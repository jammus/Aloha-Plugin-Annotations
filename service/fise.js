/*!
 * Licensed under the MIT (MIT-LICENSE.txt) http://creativecommons.org/licenses/MIT/
 * 
 * Copyright (c) 2010 Gentics
 * Author Rene Kapusta (http://twitter.com/rene_kapusta)
 * Author Haymo Meran (http://twitter.com/draftkraft)
 */
/**
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Create the Services object. Namespace for Services
 * @hide
 */
if ( !GENTICS.Aloha.Annotations.Services ) GENTICS.Aloha.Annotations.Services = {};

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Annotations.Services.fise = new GENTICS.Aloha.Annotations.Service('com.gentics.aloha.plugins.Annotations.service.fise');

/**
 * init IKS Fise Service
 */
GENTICS.Aloha.Annotations.Services.fise.init = function() {
	var that = this;
	
	this.subscribeEvents();
	
	// REST API Endpoint URL.
	this.ApiEndpoint = "http://fise.demo.nuxeo.com/engines/";
	if (GENTICS.Aloha.Annotations.settings.Services && GENTICS.Aloha.Annotations.settings.Services.fise && GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint) {
	   this.ApiEndpoint = GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint;
    }

	// (due to bug in fise: text/plain == json-ld output); application/json, application/rdf+xml, application/rdf+json, text/turtle or text/rdf+nt
	this.ResponseFormat = "text/plain";
	
	if ( this.settings.ApiKey ) {
		// set the service name
		this.repositoryName = 'fise/' + this.settings.ApiKey;
	} else {
		// set the service name
		this.repositoryName = 'fise/public';
	}
};

/**
 * Subscribe for events
 */
GENTICS.Aloha.Annotations.Services.fise.subscribeEvents = function () {

	var that = this;	
	
    // add the event handler for editableDeactivated
    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableDeactivated', function(event, rangeObject) {
    	if (GENTICS.Aloha.activeEditable) {
    	    
    		var url = false;
    		
			if (GENTICS.Aloha.settings.proxyUrl) {
               // the service url is passed as Query parameter, so it needs to be URLEncoded!
               url = GENTICS.Aloha.settings.proxyUrl + that.ApiEndpoint;
            } else {
                alert('ERROR: GENTICS.Aloha.settings.proxyUrl not defined. Configure your AJAXproxy Plugin.');
            }
            
			var timeout = 1000;

			var data = {
				content: GENTICS.Aloha.activeEditable.getContents(),
				ajax: true,
				format: that.ResponseFormat
			};

			// submit the data to our proxy
			jQuery.ajax({
				type: "POST",
				url: url,
				data: data,
				//dataType: "html",
				contentType: 'text/plain',
				cache: false,
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Accept', that.ResponseFormat);
					xhr.setRequestHeader('X-Service-Info', 'Aloha Editor Annotation Service');
				},
				success: function(result) {
					var obj = jQuery.parseJSON(result);
					var suggestionsContainer = jQuery("input.as-input");
					var suggestions = [];
                    
					// try / catch instead of:
					if (obj["@"] == undefined) {
						obj["@"] = [];
						obj["@"][0] = false;
					}
					
					for (i = 0; i < obj["@"].length; i++) {
						var label = obj["@"][i]["http://fise.iks-project.eu/ontology/entity-label"];
						var confidence = obj["@"][i]["http://fise.iks-project.eu/ontology/confidence"];
						//if (label == undefined) {
						//	var label = obj["@"][i]["http://fise.iks-project.eu/ontology/selected-text"];
						//}
						if (label != undefined && confidence != undefined) {
							//var re = new RegExp('\"(.*)\"\^\^<\w+:\w+>'); // not working for "Tag Name"^^<ns5:string>
							// Suggestion
							var re = new RegExp('\"(.*)\"');
							var match = re.exec(label);
							
							// Confidence -- ""0.01657282257080078"^^<http://www.w3.org/2001/XMLSchema#double>"
							// @todo -- move to config
							var re = new RegExp('\"(1\.*)\"');
							var match_confidence = re.exec(confidence);
							if (match != null && match_confidence != null) {
								if (jQuery.inArray(match[1], suggestions) < 0) { // a bit of that is now also in the autoSuggest plugin
									suggestions.push(match[1]);
								}
							}
						}
					};
					for (i=0; i < suggestions.length; i++) {
						suggestionsContainer[0].add_selected_item({name:suggestions[i], value:suggestions[i]});
					}
				},
				error: function(result) {
					GENTICS.Aloha.Annotations.log('error', 'There was an error fetching the contents of the annotation service.');
				}
			});
		}
	});
};