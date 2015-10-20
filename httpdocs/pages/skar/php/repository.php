<?php

require_once ( 'connection.php' );
require_once ( 'resource.php' );

class Repository extends Connection
{
    // finder functions: find, list

    function Repository()
    {
        $this->connect();
    }

    function cleanup()
    {
      $this->close();
    }

    function update( $arg )
    {
        debug( 'Repository->update()' );

        if ( is_object( $arg ) )
        {
            if ( 'error' == get_class( $arg ) )
            {
                $this->close();
            }
        }
    }

    /* Finders */

    function findUser( $dn, $pass )
    {
        $user = null;

        $query =
            "SELECT * FROM `user`
             WHERE `dn` = '$dn'
            AND `password` = '$pass' LIMIT 1";

        $sqlResult = pdo_query( $query )
            or die ( 'Repository->findUser() - error: ' . pdo_error() );

        if ( $sqlResult != null )
        {
            while ( ( $row = pdo_fetch_assoc( $sqlResult ) ) !== false )
            {
                $user = new User();

                $user->id = $row['id'];
                $user->dn = $row['dn'];
                $user->cn = $row['cn'];

                break;
            }

            unset( $sqlResult );
        }

        return $user;
    }

    function listDependents( $id )
    {
        return $this->_fetchResources( "SELECT * FROM `resource` WHERE `id` in ( SELECT `source` FROM `link` WHERE `target` = $id )" );
    }

    function findResource( $id )
    {
        return $this->_fetchResource( "SELECT * FROM `resource` WHERE `id` = $id" );
    }

    function findJournal()
    {
        $journals = $this->_fetchResources(
            "SELECT * FROM `resource`
             WHERE `oc` = 'Link'
             AND `type` = 'journal'
             ORDER BY `pubdate` DESC LIMIT 1"
        );

        if ( $journals != null && count( $journals ) > 0 )
        {
            return $journals[0];
        }

        return null;
    }

    /* Listings */

    function listNews( $limit )
    {
        return $this->_fetchResources(
            "SELECT * FROM `resource`
             WHERE `oc` = 'Story' AND `type` = 'news'
             ORDER BY `pubdate` DESC, `modified` DESC
             LIMIT $limit"
        );
    }

    function listFolders( $parent )
    {
        if ( $parent == null || $parent == 'null' || $parent == 0 )
        {
            return $this->_fetchResources(
                "SELECT * FROM `resource`
                 WHERE `parent` is null
                 AND `oc` = 'Folder'
                 ORDER BY `cindex`, `cn`"
            );
        }
        else
        {
            return $this->_fetchResources(
                "SELECT * FROM `resource`
                 WHERE `parent` = $parent
                 AND `oc` = 'Folder'
                 ORDER BY `cindex`, `cn`"
            );
        }
    }

    function listLinks()
    {
        return $this->_fetchResources(
           "SELECT `oc`, `id`, `cn`, `uri`, `type` FROM `resource`
            WHERE `oc` = 'Story' OR `oc` = 'Folder' OR ( `oc` = 'Link' AND ( `type` = 'journal' OR `type` = 'pdf' ) )
            ORDER BY `cn`"
        );
    }

    function listImages( $folder, $property )
    {
        $result = array();

        $files = glob( "$folder/$property->uri*.jpg" );

        foreach ( $files as $file )
        {
            $image = new Image();

            $image->property = $property->cn;

            $info = pathinfo( $file );

            list( $property->uri, $cindex, $description ) = preg_split( "/[_\.]/", $info['basename'] );

            sscanf( $cindex, "%d", $image->id );

            $image->cn = $info['basename'];

            $image->description = ucwords( $description );

            $image->uri = str_replace( $_SERVER['DOCUMENT_ROOT'], '', realpath( $file ) );

            $result[] = $image;
        }

        return $result;
    }

    /*
    function listResources( $parent, $types, $orderByClause )
    {
        $ocClause = '';

        if ( $types != null )
        {
            $ocClause = "(";

            for ( $i = 0; $i < count( $types ); $i++ )
            {
                if ( $i > 0 ) $ocClause .= " or";
                $ocClause .= ( " `oc` = '$types[$i]'" );
            }

            $ocClause .= " ) AND";
        }

        $parentClause = ( $parent == 0 ? '`parent` is null' : ( '`parent` = ' . $parent ) );

        $sqlQuery =
           "SELECT * FROM `resource` WHERE $ocClause $parentClause ORDER BY $orderByClause";

        $resources = $this->_fetchResources( $sqlQuery );

        return $resources;
    } */

    /* Retrieval */

    function retrievePages( $id )
    {
        return $this->values(
            "SELECT `content` FROM `page` WHERE `resource` = $id ORDER BY `cindex`",
            'content'
        );
    }

    function retrieveInternalLinks( $id )
    {
        return $this->_fetchResources(
            "SELECT r.`oc`, r.`id`, r.`parent`, r.`cn`, r.`uri`, r.`type`
            FROM `link` l LEFT OUTER JOIN `resource` r
            ON l.`destination` = r.`id`
            WHERE l.`source` = $id"
        );
    }


    /* Helpers */

    function _fetchResource( $query )
    {
        $resource = null;

        debug( "Repository->_fetchResource() query: $query" );

        $sqlResult = pdo_query( $query )
            or die ( 'Repository->fetchResource() - error: ' . pdo_error() );

        if ( $sqlResult != null )
        {
            while ( ( $row = pdo_fetch_assoc( $sqlResult ) ) !== false )
            {
                $resource = $this->createResource( $row['oc'], $row );

                break;
            }

            unset( $sqlResult );
        }

        $resourceClass = get_class( $resource );

        debug( "found resource from class: $resourceClass");

        switch( $resourceClass )
        {
            case 'Story':
            {
                $resource->links = $this->retrieveInternalLinks( $resource->id );

                $resource->pages = $this->retrievePages( $resource->id );

                break;
            }
            case 'Folder':
            {
                $resource->folders = $this->_fetchResources(
                    "SELECT * FROM `resource`
                    WHERE `parent` = $resource->id
                    AND `oc` = 'Folder'
                    ORDER BY `cindex`, `cn`"
                );

                if ( 'link' == $resource->type )
                {
                    $resource->items = $this->_fetchResources(
                        "SELECT * FROM `resource`
                         WHERE `parent` = $resource->id
                         AND `oc` = 'Link'
                         ORDER BY `cn`"
                    );
                }
                else if ( 'journal' == $resource->type )
                {
                    $resource->items = $this->_fetchResources(
                        "SELECT * FROM `resource`
                         WHERE `parent` = $resource->id
                         AND `oc` = 'Link'
                         AND `type` = 'journal'
                         ORDER BY `pubdate` DESC"
                    );
                }
                else if ( 'property' == $resource->type )
                {
                    $resource->items = $this->_fetchResources(
                        "SELECT * FROM `resource`
                         WHERE `parent` = $resource->id
                         AND `oc` = 'Property'
                         ORDER BY `uri`"
                    );
                }
                else
                {
                    $resource->items = $this->_fetchResources(
                        "SELECT * FROM `resource`
                         WHERE `parent` = $resource->id
                         AND `oc` = 'Story'
                         ORDER BY `cindex` ASC, `pubdate` DESC"
                    );
                }

                break;
            }
            case 'Property':
            {
                $resource->backgrounds = $this->listImages(
                    '../images/backgrounds',
                    $resource );

                $resource->thumbnails = $this->listImages(
                    '../images/thumbnails',
                    $resource );
            }
            default:
            {
                break;
            }
        }

        return $resource;
    }

    function _fetchResources( $query )
    {
        $result = array();

        debug( "Repository->_fetchResources() query: $query" );

        $sqlResult = pdo_query( $query )
            or die ( 'Repository->_fetchResources() - error: ' . pdo_error() );

        if ( $sqlResult != null )
        {
            while ( ( $row = pdo_fetch_assoc( $sqlResult ) ) !== false )
            {
                $resource = $this->createResource( $row['oc'], $row );

                /*
                if ( 'Folder' == $row['oc'] )
                {
                    $resource->items = $this->_fetchResources(
                        "SELECT * FROM `resource`
                        WHERE $ocClause $parentClause
                        ORDER BY $orderByClause"
                    );

                    $resource->items = $this->listResources (
                        $resource->id,
                        array ( 'Story', 'Link', 'Property' ),
                        '`cindex`, `pubdate` desc, `uri`, `cn`'
                    );
                }
                 */

                $result[] = $resource;
            }

            unset( $sqlResult );
        }

        debug( "Repository->_fetchResources() found: " . count( $result ) );

        return $result;
    }

    // crud functions: create, update, delete

    // create function

    function createResource( $target, $values )
    {
        $result = null;

        switch( $target )
        {
            case 'Folder':
                $result = new Folder();
                break;
            case 'Form':
                $result = new Form();
                break;
            case 'Link':
                $result = new Link();
                break;
            case 'Property':
                $result = new Property();
                break;
            case 'Story':
                $result = new Story();
                break;
            default:
                die ( 'Repository->createResource() - Unsupported type: ' . $target );
                break;
        }

        $result->setValues( $values );

        return $result;
    }

    // update function

    function updateResource( $resource )
    {
        $resource->modified = date( 'Y-m-d h:i:s');

        $resource->user = $_SESSION['PHP_AUTH_USER'];

        $vals = get_object_vars( $resource );

        if ( $resource->id == -1 )
        {
            $query = "SELECT ( MAX( `id` ) + 1 ) AS `result` FROM `resource`";

            $resource->id = $this->fetch( $query, $this->connection );

            $attrs = array(
                'oc',
                'parent',
                'cn',
                'description',
                'pubdate',
                'cindex',
                'uri',
                'home',
                'type'
            );

            $attrClause = "`id`, ";
            $valsClause = "$resource->id, ";

            foreach ( $attrs as $attr )
            {
                if ( $vals[$attr] != null && $vals[$attr] != '' )
                {
                    $attrClause .= " `$attr`, ";
                    $valsClause .= " '$vals[$attr]', ";
                }
            }

            $attrClause .= "`modified`, `user`";
            $valsClause .= "'$resource->modified', $resource->user";

            $query = "INSERT INTO `resource` ( $attrClause ) VALUES ( $valsClause )";
        }
        else
        {
            $attrs = array(
                'cn',
                'description',
                'pubdate',
                'cindex',
                'uri',
                'home',
                'type'
            );

            $query = "UPDATE `resource` SET";

            foreach ( $attrs as $attr )
            {
                $query .= " `$attr` = '$vals[$attr]', ";
            }

            $query .= "`modified` = '$resource->modified', ";
            $query .= "`user` = $resource->user ";
            $query .= "WHERE `id` = $resource->id LIMIT 1";
        }

        $this->execute( $query, $this->connection );

        if ( $resource instanceof Story )
        {
            // pages

            $query = "DELETE FROM `page` WHERE `resource` = $resource->id";

            $this->execute( $query, $this->connection );

            $count = count ( $resource->pages );

            for ( $i=1; $i <= $count; $i++ )
            {
                $content = $resource->pages[$i-1];

                $content = addslashes( $content );

                $query = "INSERT INTO `page` ( `resource`, `cindex`, `content` )
                          VALUES ( $resource->id, $i, '$content' )";

                $this->execute( $query, $this->connection );
            }

            // links

            $query = "DELETE FROM `link` WHERE `source` = $resource->id";

            $this->execute( $query, $this->connection );

            foreach( $resource->links as $link )
            {
                $query = "INSERT INTO `link` ( `source`, `destination` ) VALUES ( $resource->id, $link->id )";

                $this->execute( $query, $this->connection );
            }

            $resource->links = $this->retrieveInternalLinks( $resource->id );
        }
    }

    // delete function

    function deleteResource( $id )
    {
        $this->execute( "DELETE FROM `resource` WHERE `id` = $id", $this->connection );
    }
}

?>
