cordova.define("cordova-plugin-traceclass.traceclass", function(require, exports, module) { /*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

var traceclass = {
		getUserInfo: function() {
			exec(
			function success(result)
			{
				document.UserInfo = JSON.parse(result.UserInfo);
			}, 
			function error(result)
			{
			
			},
			'TRACEClass', 'CMD_GetUserInfo', []);
		},
		
		httpPost: function(successCallback, errorCallback, config)
		{
			if(config instanceof Array) {
		        // do nothing
		    } else {
		        if(typeof(config) === 'object') {
		            config = [ config ];
		        } else {
		            config = [];
		        }
		    }

			exec(successCallback, errorCallback, 'TRACEClass', 'CMD_HttpPost', config);
		},
		
		startRecord: function(successCallback, errorCallback, config)
		{
			if(config instanceof Array) {
		        // do nothing
		    } else {
		        if(typeof(config) === 'object') {
		            config = [ config ];
		        } else {
		            config = [];
		        }
		    }
			
			exec(successCallback, errorCallback, 'TRACEClass', 'CMD_StartAudioRecord', config);
		},
		
		stopRecord: function(successCallback, errorCallback, config)
		{
			if(config instanceof Array) {
		        // do nothing
		    } else {
		        if(typeof(config) === 'object') {
		            config = [ config ];
		        } else {
		            config = [];
		        }
		    }

			exec(successCallback, errorCallback, 'TRACEClass', 'CMD_StopAudioRecord', config);
		},
		
		exitActivity: function(successCallback, errorCallback, config)
		{
			if(config instanceof Array) {
		        // do nothing
		    } else {
		        if(typeof(config) === 'object') {
		            config = [ config ];
		        } else {
		            config = [];
		        }
		    }

			exec(successCallback, errorCallback, 'TRACEClass', 'CMD_ExitSubjectActivity', config);
		},

		setsubjectTitle: function (successCallback, errorCallback, config)
        {
            if(config instanceof Array) {
                // do nothing
            } else {
                if(typeof(config) === 'object') {
                    config = [ config ];
                } else {
                    config = [];
                }
            }

            exec(successCallback, errorCallback, 'TRACEClass', 'CMD_SetTitle_SUBJECt', config);
        },

        intentInfo: function (successCallback, errorCallback, config)
                {
                    if(config instanceof Array) {
                        // do nothing
                    } else {
                        if(typeof(config) === 'object') {
                            config = [ config ];
                        } else {
                            config = [];
                        }
                    }
                    exec(successCallback, errorCallback, 'TRACEClass', 'CMD_intentInfo', config);
                }
};

traceclass.getUserInfo();

module.exports = traceclass

});
