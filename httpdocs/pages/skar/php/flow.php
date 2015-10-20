<?php

function getFlow()
{
    $flow = new Flow();

    // Category

    $form = new Form(
        'category',
        'Doelgroep',
        'Tot welke doelgroep behoort u?',
        'contract'
    );

    $form->add( new Option( 'arts', 'Kunsten', 'contract' ) );
    $form->add( new Option( 'media', 'Media en Entertainment', 'contractmedia' ) );
    $form->add( new Option( 'service', 'Creatieve zakelijke dienstverlening', 'contract' ) );
    $form->add( new Option( 'other', 'Anders', 'nocategory' ) );

    $flow->add( $form );

    // Contract

    $form = new Form(
        'contract',
        'Duur overeenkomst',
        'Wenst u een tijdelijk of permanent atelier, dan wel projectruimte?',
        'size'
    );

    $option = new Option( 'permanent', 'Permanent', 'size' );
    $option->info = 'Voor professionele kunstenaars die een werkplek zoeken voor langere tijd';
    $form->add( $option );

    $option = new Option( 'temporary', 'Tijdelijk', 'size' );
    $option->info = 'Voor professionele kunstenaars, in afwachting van een permanent atelier en voor startende creatieve ondernemers die een goede tijdelijke oplossing zoeken';
    $form->add( $option );

    $option = new Option( 'both', 'Permanent en tijdelijk', 'size' );
    $option->info = 'Voor professionele kunstenaars, in afwachting van een permanent atelier en voor startende creatieve ondernemers die een goede tijdelijke oplossing zoeken';
    $form->add( $option );

    $option = new Option( 'project', 'Project', 'size' );
    $option->info = 'Te huur voor een periode van 3,6 of 9 maanden, om een project uit te voeren of een experiment aan te gaan';
    $form->add( $option );

    $flow->add( $form );

    // Contract Media

    $form = new Form(
        'contractmedia',
        'Duur overeenkomst',
        'Wenst u een tijdelijk of permanent atelier, dan wel projectruimte?',
        'size'
    );

    $option = new Option( 'permanent', 'Permanent', '25kv' );
    $option->info = 'Voor professionele kunstenaars die een werkplek zoeken voor langere tijd, in het 25kv gebouw of bij SKAR';
    $form->add( $option );

    $option = new Option( 'temporary', 'Tijdelijk', 'size' );
    $option->info = 'Voor professionele kunstenaars, in afwachting van een permanent atelier en voor startende creatieve ondernemers die een goede tijdelijke oplossing zoeken';
    $form->add( $option );

    $option = new Option( 'both', 'Permanent en tijdelijk', '25kv' );
    $option->info = 'Voor professionele kunstenaars, in afwachting van een permanent atelier in het 25 kv gebouw of bij SKAR en voor startende creatieve ondernemers die een goede tijdelijke oplossing zoeken.';
    $form->add( $option );

    $option = new Option( 'project', 'Project', 'size' );
    $option->info = 'Te huur voor een periode van 3,6 of 9 maanden, om een project uit te voeren of een experiment aan te gaan';
    $form->add( $option );

    $flow->add( $form );

    // 25KV

    $form = new Form(
        '25kv',
        '25kv',
        'Bent u geïnteresseerd in een ruimte in het 25 kv gebouw? Neem contact op met de <a href="http://www.obr.rotterdam.nl/smartsite2135761.dws?Menu=746096&MainMenu=746096" target="_blank">ondernemerswinkel</a> van het OBR en meldt u tevens aan voor de wachtlijst bij SKAR. SKAR toetst de professionaliteit van de kandidaten en adviseert het OBR bij de toewijzing van deze ruimtes.',
        'size'
    );

    $flow->add( $form );

    // Size

    $form = new Form(
        'size',
        'Oppervlakte',
        'Wat is de door u gewenste oppervlakte?',
        'space'
    );

    $form->add( new Option( 'small', 'Tot 50 m2', 'space' ) );
    $form->add( new Option( 'medium', 'Tussen 50-100 m2', 'space' ) );
    $form->add( new Option( 'large', 'Groter dan 100 m2', 'size2' ) );

    $flow->add( $form );

    // Size 2

    $form = new Form(
        'size2',
        'Oppervlakte',
        'Een gemiddelde werkruimte is 50 m2, enkele ateliers zijn groter.',
        'size'
    );

    $form->add( new Option( 'smaller', 'Ik kies een kleiner atelier', 'size' ) );
    $form->add( new Option( 'larger', 'Ik wil toch een atelier >100 m2', 'nospace' ) );

    $flow->add( $form );

    // Werkruimte

    $form = new Form(
        'space',
        'Individueel of groep',
        'Betreft de aanmelding een individu of een groep?',
        null
    );

    $form->add( new Option( 'individual', 'Individueel', 'criteria-individual' ) );
    $form->add( new Option( 'group', 'Groep, collectief of ander samenwerkingsverband', 'criteria-group' ) );

    $flow->add( $form );

    // Individual

    $form = new Form(
        'criteria-individual',
        'Voorwaarden',
        '<b>Voorwaarden</b><p/>Kandidaten voor een SKAR atelier dienen aan de volgende voorwaarden te voldoen:<ul><li>woonachtig te Rotterdam</li><li>beroepsmatig werkzaam als kunstenaar</li><li>de productie van kunst gebeurt zodanig dat overlast beperkt blijft.</li></ul><p/><b>Professionaliteit</b><p/>Indien een kandidaat niet ingeschreven staat bij het Centrum Beeldende Kunst of een kunstinstelling die vergelijkbare beroepscriteria hanteert, wordt de professionaliteit vastgesteld door de Atelier Commissie (AC) of voor disciplines waarvoor binnen de AC geen deskundigheid is, door externe deskundigen.<p/>Beoordeling vindt plaats op basis van beeld-/geluid- en documentatiemateriaal met curriculum vitae.<p/>Professionaliteit wordt aan de hand van criteria, in onderlinge samenhang, gewogen.<p/><b>Beroepsopleiding, scholing en nevenactiviteiten</b><p/>Naast de opleiding kunnen ook van belang zijn: nevenactiviteiten zoals bestuurs- en commissie werkzaamheden, docentschap, aansluiting bij een beroepsvereniging, kunstenaarsinitiatieven en dergelijke. Bij autodidacten wordt gekeken naar vakmatigheid, zoals beheersing van technieken en de ontwikkeling van autonome aspecten van het werk.<p/><b>Beroepsmatige activiteiten</b><p/>Deze blijken onder andere uit de ontwikkeling van autonoom werk; publieke en marktgerichte activiteiten; deelname aan projecten en manifestaties, verkopen, inschrijvingen voor opdrachten.<p/><b>Erkenning van het kunstenaarschap door derden</b><p/>Deze erkenning blijkt onder meer uit gerealiseerde opdrachten; aankopen door particulieren, overheden, kunstinstellingen en bedrijven; prijzen, beurzen, stipendia; publicaties; voorstellingen en recensies.',
        null
    );

    $form->add( new Option( 'on', 'Ik heb kennis genomen van de voorwaarden', 'submit' ) );

    $flow->add( $form );

    // Criteria group

    $form = new Form(
        'criteria-group',
        'Voorwaarden',
        '<b>Voorwaarden</b><p/><ul><li>Het initiatief wordt door derden gesubsidieerd.</li><li>Het initiatief betekent een verrijking van het aanbod binnen de Rotterdamse kunstsector.</li><li>(Voor intermediairs:) Het initiatief bereikt een voor de Rotterdamse kunstsector relevante (evt. nieuwe) doelgroep.</li></ul>',
        null
    );

    $form->add( new Option( 'on', 'Ik heb kennis genomen van de voorwaarden', 'submit' ) );

    $flow->add( $form );

    // No category

    $form = new Form(
        'nocategory',
        'Doelgroep',
        'Hoort u wel tot de culturele sector maar twijfelt u of u tot de doelgroep behoort en heeft u een huisvestingsvraag  dan kunt u altijd <a href="mailto:info@skar-ateliers.nl">contact</a> opnemen met SKAR.',
        'exit'
    );

    $flow->add( $form );

    // No space

    $form = new Form(
        'nospace',
        'Oppervlakte',
        'Voor grotere ateliers verwijzen wij u naar de <a href="http://www.obr.rotterdam.nl/smartsite2135761.dws?Menu=746096&MainMenu=746096" target="_blank">ondernemerswinkel</a> van het OBR. Natuurlijk kunt u voor uw huisvestingsvraag ook <a href="mailto:info@skar-ateliers.nl">contact</a> opnemen met SKAR.',
        'exit'
    );

    $flow->add( $form );

    // Submit

    $form = new Form(
        'submit',
        'Adresgegevens',
        'Vul uw adresgegevens in. De aanmeldingsformulieren worden dan zo spoedig mogelijk naar u gestuurd.',
        'exit'
    );

    $flow->add( $form );

    // Exit

    $form = new Form( 'exit',
        'Aanmelding voltooid',
        'Kies "Sluiten".',
        null
    );

    $flow->add( $form );

    return $flow;
}

class Flow
{
    var $forms;

    function Flow()
    {
        $this->forms = array();
    }

    function add( $form )
    {
        $this->forms[$form->id] = $form;
    }

    function find( $id )
    {
        return $this->forms[$id];
    }
}

class Form
{
    var $id;
    var $title;
    var $text;
    var $options;
    var $target;

    function Form( $id, $title, $text, $target )
    {
        $this->id = $id;
        $this->title = $title;
        $this->text = $text;
        $this->target = $target;
        $this->options = array();
    }

    function add( $option )
    {
        $this->options[] = $option;
    }

    function find( $id )
    {
        $result = null;

        foreach ( $this->options as $next )
        {
            if ( $id == $next->id )
            {
                $result = $next;
                break;
            }
        }

        return $result;
    }

    function target( $id )
    {
        $option = $this->find( $id );

        if ( $option->target != null )
        {
            return $option->target;
        }

        return $this->target;
    }
}

class Option
{
    var $id;
    var $text;
    var $target;
    var $info;

    function Option( $id, $text, $target )
    {
        $this->id = $id;
        $this->text = $text;
        $this->target = $target;
    }
}

?>