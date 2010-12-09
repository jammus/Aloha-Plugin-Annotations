/*!
 * Licensed under the MIT (MIT-LICENSE.txt) http://creativecommons.org/licenses/MIT/
 * 
 * Copyright (c) 2010 Gentics Software GmbH, Vienna (http://gentics.com)
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
GENTICS.Aloha.Annotations.Services.zemanta = new GENTICS.Aloha.Annotations.Service('com.gentics.aloha.plugins.Annotations.service.zemanta');

/**
 * If no API key is given, the public service is searched:
 * @property
 * @cfg
 */
GENTICS.Aloha.Annotations.Services.zemanta.settings.ApiKey = '1234567890';
GENTICS.Aloha.Annotations.Services.zemanta.settings.ResponseFormat = 'rdfxml';

/**
 * init Zemanta Service
 */
GENTICS.Aloha.Annotations.Services.zemanta.init = function() {
	var that = this;
	
	// see: http://developer.zemanta.com/docs/suggest_markup/
	
	// REST API Endpoint URL.
	this.ApiEndpoint = "http://api.zemanta.com/services/rest/0.0/";
	
	// API method
	this.ApiMethod = "zemanta.suggest_markup";
	
	// "xml", "json", "rdfxml"
	this.ResponseFormat = "rdfxml"; 
		
	if ( this.settings.ApiKey ) {
		// set the repository name
		this.repositoryName = 'zemanta/' + this.settings.ApiKey;
	} else {
		// set the repository name
		this.repositoryName = 'zemanta/public';
	}
};