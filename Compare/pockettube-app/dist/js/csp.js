
const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
var passThroughFunc = function(string, sink){
	return string; // Anything passing through this function will be returned without change
}
var TTPName = "passthrough";
var TTP_default, TTP = {createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc}; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
var needsTrustedHTML = false;
function doit(){
	try{
		if(typeof window.isSecureContext !== 'undefined' && window.isSecureContext){
			if (window.trustedTypes && window.trustedTypes.createPolicy){
				needsTrustedHTML = true;
				if(trustedTypes.defaultPolicy){
					log("TT Default Policy exists");
					if(overwrite_default)
						TTP = window.trustedTypes.createPolicy("default", TTP);
					else
						TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
					TTP_default = trustedTypes.defaultPolicy;

					log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
				}
				else{
					TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
				}
				log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
			}
		}
	}catch(e){
		log(e);
	}
}

function log(...args){
	if("undefined" != typeof(debugging) && !!debugging)
		args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
	console.log(...args);
}

doit();