<?php

class Singleton
{
    public static function &getInstance ( $class, $name = NULL )
    {
        static $registry = array();

        $_instanceName = is_null( $name ) ? $name : $class;

        if ( !isset($registry[$class][$_instanceName]) ||
             !is_object($registry[$class][$_instanceName]) )
        {
            $registry[$class][$_instanceName] = new $class;
        }

        return $registry[$class][$_instanceName];
    }
}

?>