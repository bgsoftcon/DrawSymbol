/**
 * @copyright  2011 geOps
 * @license    https://github.com/geops/ole/blob/master/license.txt
 * @link       https://github.com/geops/ole
 */

/**
 * Class: OpenLayers.Editor.Control.DrawSymbol
 *
 * Inherits from:
 *  - <OpenLayers.Control.DrawFeature>
 */
OpenLayers.Editor.Control.DrawSymbol = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
  
   
	
    title: OpenLayers.i18n('oleDrawSymbol'),
    featureType: 'point',
	
    /**
     * Constructor: OpenLayers.Editor.Control.DrawPath
     * Create a new control for drawing points.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer.Vector>} Points will be added to this layer.
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */
    initialize: function (layer, options) {
        this.callbacks = OpenLayers.Util.extend(this.callbacks, {
            point: function (point) {
                this.layer.events.triggerEvent('pointadded', {point: point});
            }
        });

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this,
                [layer, OpenLayers.Handler.Point, options]);

        this.title = OpenLayers.i18n('oleDrawSymbol');
    },
	
	activate: function () {
        var activated = OpenLayers.Control.prototype.activate.call(this);
        if (activated) {
            this.openDialog();
        }
        return activated;
    },

    deactivate: function () {
        var deactivated = OpenLayers.Control.prototype.deactivate.call(this);
        if (deactivated) {
            if (this.dialog) {
                this.dialog.hide();
                this.dialog = null;
            }
        }
        return deactivated;
    }, 

    /**
     * Cancel file download Dialog.
     */
    cancelDialog: function () {
        this.dialog = null;
    },	
	/**
     * Open popup Dialog, for selecting download options like format.
     */
    openDialog: function () {
	 // Create content for the popup Dialog
        var content = document.createElement("div");

        var text = document.createElement("p");
        text.innerHTML = OpenLayers.i18n('please choose mapsymbol');
        content.appendChild(text);
		
		var formElm = document.createElement("form");
		 // Input element for selecting local file
        formElm = this.createInputElm('oleFile', 'file', 'file',null, formElm);
		content.appendChild(formElm);
		
		 
		 
		OpenLayers.Event.observe(formElm, 'click', OpenLayers.Function.bind(function (event) {
            // Prevent propagation of event to drawing controls
            OpenLayers.Event.stop(event, true);
        }, this));
		
		
		// Show popup Dialog
        this.dialog = this.map.editor.dialog;
		//window.windowHide=true;
        this.dialog.show({
            title: OpenLayers.i18n('Draw Mapsymbol'),
            content: content,
			saveButtonText: "load",
			cancelButtonText:"draw",
            save: OpenLayers.Function.bind(this.downloadFeature,this),
            cancel: OpenLayers.Function.bind(this.cancelDialog,this),
            noHideOnSave: true,
			
        });
	
	},
	   downloadFeature: function () {
	   window.ifn = document.getElementById('oleFile').value;
	  /* if(
	         window.windowHide == true){
	   alert("true");
	   this.dialog = null;
	   
	   }*/
	 }, 
	 createInputElm: function (id,name, type, value, parentElm) {
        var inputElm = document.createElement('input');
        inputElm.setAttribute('type', 'file');
		inputElm.id = id;
        inputElm.name = name;
        inputElm.value = value ? value : null;
        if (parentElm) {
            parentElm.appendChild(inputElm);
        }
        return parentElm;
    },
	
    /**
     * Method: draw point
     */
	 
    drawFeature: function (geometry) {
	    
        var feature = new OpenLayers.Feature.Vector(geometry,null,{
		externalGraphic: 'lib/geosilk/img/testicons/'+window.ifn,//FF
		//externalGraphic: window.fname,//IE
        graphicWidth: 32,
        graphicHeight: 32,
        fillOpacity: 1
    });
           proceed = this.layer.events.triggerEvent('sketchcomplete', {feature: feature});

        feature.featureType = this.featureType;

        if (proceed !== false) {
            this.events.triggerEvent('beforefeatureadded', {feature: feature});
            feature.state = OpenLayers.State.INSERT;
            this.layer.addFeatures([feature]);
            this.featureAdded(feature);
            this.events.triggerEvent('featureadded', {feature: feature});
        }
    },
	
	/*document.body.onclick:function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 

    alert("Right mouse button " + (isRightMB ? "was not " : "") + "clicked!");
},*/
    CLASS_NAME: 'OpenLayers.Editor.Control.DrawSymbol'
});