/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r._components=void 0,r._getProvider=g,r._registerComponent=E,r._removeServiceInstance=function(e,t,r=d){g(e,t).clearInstance(r)},r.deleteApp=async function(e){const t=e.name;p.has(t)&&(p.delete(t),await Promise.all(e.container.getProviders().map((e=>e.delete()))),e.isDeleted=!0)},r.getApp=function(e=d){const t=p.get(e);if(!t&&e===d&&(0,i.getDefaultAppConfig)())return T();if(!t)throw y.create("no-app",{appName:e});return t},r.getApps=function(){return Array.from(p.values())},r.initializeApp=T,r.onLog=function(e,t){if(null!==e&&"function"!=typeof e)throw y.create("invalid-log-argument");(0,o.setUserLogHandler)(e,t)},r.registerVersion=A,r.setLogLevel=function(e){(0,o.setLogLevel)(e)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/es.regexp.exec.js"),e("core-js/modules/web.dom-collections.iterator.js");var n=e("@firebase/component"),o=e("@firebase/logger"),i=e("@firebase/util"),s=e("idb");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class a{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const u="@firebase/app",l="0.9.27",c=new o.Logger("@firebase/app"),d=r._DEFAULT_ENTRY_NAME="[DEFAULT]",f={[u]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},p=r._apps=new Map,h=r._components=new Map;function _(e,t){try{e.container.addComponent(t)}catch(r){c.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function E(e){const t=e.name;if(h.has(t))return c.debug(`There were multiple attempts to register component ${t}.`),!1;h.set(t,e);for(const t of p.values())_(t,e);return!0}function g(e,t){const r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}const m={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},y=new i.ErrorFactory("app","Firebase",m);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class S{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new n.Component("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw y.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */r.SDK_VERSION="10.8.0";function T(e,t={}){let r=e;if("object"!=typeof t){t={name:t}}const o=Object.assign({name:d,automaticDataCollectionEnabled:!1},t),s=o.name;if("string"!=typeof s||!s)throw y.create("bad-app-name",{appName:String(s)});if(r||(r=(0,i.getDefaultAppConfig)()),!r)throw y.create("no-options");const a=p.get(s);if(a){if((0,i.deepEqual)(r,a.options)&&(0,i.deepEqual)(o,a.config))return a;throw y.create("duplicate-app",{appName:s})}const u=new n.ComponentContainer(s);for(const e of h.values())u.addComponent(e);const l=new S(r,o,u);return p.set(s,l),l}function A(e,t,r){var o;let i=null!==(o=f[e])&&void 0!==o?o:e;r&&(i+=`-${r}`);const s=i.match(/\s|\//),a=t.match(/\s|\//);if(s||a){const e=[`Unable to register library "${i}" with version "${t}":`];return s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&e.push("and"),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void c.warn(e.join(" "))}E(new n.Component(`${i}-version`,(()=>({library:i,version:t})),"VERSION"))}const b="firebase-heartbeat-database",O=1,I="firebase-heartbeat-store";let v=null;function N(){return v||(v=(0,s.openDB)(b,O,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(I)}catch(e){console.warn(e)}}}).catch((e=>{throw y.create("idb-open",{originalErrorMessage:e.message})}))),v}async function C(e,t){try{const r=(await N()).transaction(I,"readwrite"),n=r.objectStore(I);await n.put(t,R(e)),await r.done}catch(e){if(e instanceof i.FirebaseError)c.warn(e.message);else{const t=y.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});c.warn(t.message)}}}function R(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new L(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){var e,t;const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),n=w();if((null!=(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||(this._heartbeatsCache=await this._heartbeatsCachePromise,null!=(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))&&this._heartbeatsCache.lastSentHeartbeatDate!==n&&!this._heartbeatsCache.heartbeats.some((e=>e.date===n)))return this._heartbeatsCache.heartbeats.push({date:n,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter((e=>{const t=new Date(e.date).valueOf();return Date.now()-t<=2592e6})),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=w(),{heartbeatsToSend:r,unsentEntries:n}=function(e,t=1024){const r=[];let n=e.slice();for(const o of e){const e=r.find((e=>e.agent===o.agent));if(e){if(e.dates.push(o.date),P(r)>t){e.dates.pop();break}}else if(r.push({agent:o.agent,dates:[o.date]}),P(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}(this._heartbeatsCache.heartbeats),o=(0,i.base64urlEncodeWithoutPadding)(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}}function w(){return(new Date).toISOString().substring(0,10)}class L{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,i.isIndexedDBAvailable)()&&(0,i.validateIndexedDBOpenable)().then((()=>!0)).catch((()=>!1))}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await N()).transaction(I),r=await t.objectStore(I).get(R(e));return await t.done,r}catch(e){if(e instanceof i.FirebaseError)c.warn(e.message);else{const t=y.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});c.warn(t.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return C(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return C(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}}function P(e){return(0,i.base64urlEncodeWithoutPadding)(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var M;M="",E(new n.Component("platform-logger",(e=>new a(e)),"PRIVATE")),E(new n.Component("heartbeat",(e=>new D(e)),"PRIVATE")),A(u,l,M),A(u,l,"esm2017"),A("fire-js","")},{"@firebase/component":218,"@firebase/logger":220,"@firebase/util":223,"core-js/modules/es.array.iterator.js":430,"core-js/modules/es.promise.js":437,"core-js/modules/es.regexp.exec.js":442,"core-js/modules/web.dom-collections.iterator.js":453,idb:485}],218:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.Provider=r.ComponentContainer=r.Component=void 0,e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/web.dom-collections.iterator.js");var n=e("@firebase/util");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
r.Component=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};const o="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new n.Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(r)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:o})}catch(e){}for(const[e,t]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=o){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=o){return this.instances.has(e)}getOptions(e=o){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[e,t]of this.instancesDeferred.entries()){r===this.normalizeInstanceIdentifier(e)&&t.resolve(n)}return n}onInit(e,t){var r;const n=this.normalizeInstanceIdentifier(t),o=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;o.add(e),this.onInitCallbacks.set(n,o);const i=this.instances.get(n);return i&&e(i,n),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const n of r)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:(n=e,n===o?void 0:n),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(e){}var n;return r||null}normalizeInstanceIdentifier(e=o){return this.component?this.component.multipleInstances?e:o:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}r.Provider=i;r.ComponentContainer=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new i(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},{"@firebase/util":223,"core-js/modules/es.array.iterator.js":430,"core-js/modules/es.promise.js":437,"core-js/modules/web.dom-collections.iterator.js":453}],219:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.deleteInstallations=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e){const{appConfig:t}=e,r=await G(t,(e=>{if(!e||0!==e.registrationStatus)return e}));if(r){if(1===r.registrationStatus)throw _.create("delete-pending-registration");if(2===r.registrationStatus){if(!navigator.onLine)throw _.create("app-offline");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
await async function(e,t){const r=function(e,{fid:t}){return`${g(e)}/${t}`}(e,t),n=T(e,t),o={method:"DELETE",headers:n},i=await A((()=>fetch(r,o)));if(!i.ok)throw await y("Delete Installation",i)}(t,r),await F(t)}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.getId=$,r.getInstallations=
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e=(0,n.getApp)()){return(0,n._getProvider)(e,"installations").getImmediate()}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.getToken=J,r.onIdChange=function(e,t){const{appConfig:r}=e;return function(e,t){L();const r=N(e);let n=C.get(r);n||(n=new Set,C.set(r,n));n.add(t)}(r,t),()=>{!function(e,t){const r=N(e),n=C.get(r);if(!n)return;n.delete(t),0===n.size&&C.delete(r);P()}(r,t)}},e("core-js/modules/es.array.includes.js"),e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/es.regexp.exec.js"),e("core-js/modules/es.string.replace.js"),e("core-js/modules/es.typed-array.uint8-array.js"),e("core-js/modules/es.typed-array.fill.js"),e("core-js/modules/es.typed-array.set.js"),e("core-js/modules/es.typed-array.sort.js"),e("core-js/modules/web.dom-collections.iterator.js");var n=e("@firebase/app"),o=e("@firebase/component"),i=e("@firebase/util"),s=e("idb");const a="@firebase/installations",u="0.6.5",l=1e4,c=`w:${u}`,d="FIS_v2",f="https://firebaseinstallations.googleapis.com/v1",p=36e5,h={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},_=new i.ErrorFactory("installations","Installations",h);function E(e){return e instanceof i.FirebaseError&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g({projectId:e}){return`${f}/projects/${e}/installations`}function m(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function y(e,t){const r=(await t.json()).error;return _.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function S({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function T(e,{refreshToken:t}){const r=S(e);return r.append("Authorization",function(e){return`${d} ${e}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t)),r}async function A(e){const t=await e();return t.status>=500&&t.status<600?e():t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function b(e){return new Promise((t=>{setTimeout(t,e)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const O=/^[cdef][\w-]{21}$/,I="";function v(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function(e){const t=(r=e,btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_"));var r;return t.substr(0,22)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e);return O.test(t)?t:I}catch(e){return I}}function N(e){return`${e.appName}!${e.appId}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C=new Map;function R(e,t){const r=N(e);D(r,t),function(e,t){const r=L();r&&r.postMessage({key:e,fid:t});P()}(r,t)}function D(e,t){const r=C.get(e);if(r)for(const e of r)e(t)}let w=null;function L(){return!w&&"BroadcastChannel"in self&&(w=new BroadcastChannel("[Firebase] FID Change"),w.onmessage=e=>{D(e.data.key,e.data.fid)}),w}function P(){0===C.size&&w&&(w.close(),w=null)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M="firebase-installations-database",U=1,j="firebase-installations-store";let k=null;function x(){return k||(k=(0,s.openDB)(M,U,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(j)}})),k}async function B(e,t){const r=N(e),n=(await x()).transaction(j,"readwrite"),o=n.objectStore(j),i=await o.get(r);return await o.put(t,r),await n.done,i&&i.fid===t.fid||R(e,t.fid),t}async function F(e){const t=N(e),r=(await x()).transaction(j,"readwrite");await r.objectStore(j).delete(t),await r.done}async function G(e,t){const r=N(e),n=(await x()).transaction(j,"readwrite"),o=n.objectStore(j),i=await o.get(r),s=t(i);return void 0===s?await o.delete(r):await o.put(s,r),await n.done,!s||i&&i.fid===s.fid||R(e,s.fid),s}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V(e){let t;const r=await G(e.appConfig,(r=>{const n=function(e){const t=e||{fid:v(),registrationStatus:0};return Y(t)}(r),o=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(_.create("app-offline"))}}const r={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},n=async function(e,t){try{const r=await async function({appConfig:e,heartbeatServiceProvider:t},{fid:r}){const n=g(e),o=S(e),i=t.getImmediate({optional:!0});if(i){const e=await i.getHeartbeatsHeader();e&&o.append("x-firebase-client",e)}const s={fid:r,authVersion:d,appId:e.appId,sdkVersion:c},a={method:"POST",headers:o,body:JSON.stringify(s)},u=await A((()=>fetch(n,a)));if(u.ok){const e=await u.json();return{fid:e.fid||r,registrationStatus:2,refreshToken:e.refreshToken,authToken:m(e.authToken)}}throw await y("Create Installation",u)}(e,t);return B(e.appConfig,r)}catch(r){throw E(r)&&409===r.customData.serverCode?await F(e.appConfig):await B(e.appConfig,{fid:t.fid,registrationStatus:0}),r}}(e,r);return{installationEntry:r,registrationPromise:n}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:H(e)}:{installationEntry:t}}(e,n);return t=o.registrationPromise,o.installationEntry}));return r.fid===I?{installationEntry:await t}:{installationEntry:r,registrationPromise:t}}async function H(e){let t=await W(e.appConfig);for(;1===t.registrationStatus;)await b(100),t=await W(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:r}=await V(e);return r||t}return t}function W(e){return G(e,(e=>{if(!e)throw _.create("installation-not-found");return Y(e)}))}function Y(e){return 1===(t=e).registrationStatus&&t.registrationTime+l<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}async function K({appConfig:e,heartbeatServiceProvider:t},r){const n=function(e,{fid:t}){return`${g(e)}/${t}/authTokens:generate`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,r),o=T(e,r),i=t.getImmediate({optional:!0});if(i){const e=await i.getHeartbeatsHeader();e&&o.append("x-firebase-client",e)}const s={installation:{sdkVersion:c,appId:e.appId}},a={method:"POST",headers:o,body:JSON.stringify(s)},u=await A((()=>fetch(n,a)));if(u.ok){return m(await u.json())}throw await y("Generate Auth Token",u)}async function z(e,t=!1){let r;const n=await G(e.appConfig,(n=>{if(!X(n))throw _.create("not-registered");const o=n.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+p}(e)}(o))return n;if(1===o.requestStatus)return r=async function(e,t){let r=await q(e.appConfig);for(;1===r.authToken.requestStatus;)await b(100),r=await q(e.appConfig);const n=r.authToken;return 0===n.requestStatus?z(e,t):n}(e,t),n;{if(!navigator.onLine)throw _.create("app-offline");const t=function(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(n);return r=async function(e,t){try{const r=await K(e,t),n=Object.assign(Object.assign({},t),{authToken:r});return await B(e.appConfig,n),r}catch(r){if(!E(r)||401!==r.customData.serverCode&&404!==r.customData.serverCode){const r=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await B(e.appConfig,r)}else await F(e.appConfig);throw r}}(e,t),t}}));return r?await r:n.authToken}function q(e){return G(e,(e=>{if(!X(e))throw _.create("not-registered");const t=e.authToken;return 1===(r=t).requestStatus&&r.requestTime+l<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e;var r;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}))}function X(e){return void 0!==e&&2===e.registrationStatus}async function $(e){const t=e,{installationEntry:r,registrationPromise:n}=await V(t);return n?n.catch(console.error):z(t).catch(console.error),r.fid}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function J(e,t=!1){const r=e;await async function(e){const{registrationPromise:t}=await V(e);t&&await t}(r);return(await z(r,t)).token}function Z(e){return _.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q="installations",ee=e=>{const t=e.getProvider("app").getImmediate(),r=function(e){if(!e||!e.options)throw Z("App Configuration");if(!e.name)throw Z("App Name");const t=["projectId","apiKey","appId"];for(const r of t)if(!e.options[r])throw Z(r);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t);return{app:t,appConfig:r,heartbeatServiceProvider:(0,n._getProvider)(t,"heartbeat"),_delete:()=>Promise.resolve()}},te=e=>{const t=e.getProvider("app").getImmediate(),r=(0,n._getProvider)(t,Q).getImmediate();return{getId:()=>$(r),getToken:e=>J(r,e)}};(0,n._registerComponent)(new o.Component(Q,ee,"PUBLIC")),(0,n._registerComponent)(new o.Component("installations-internal",te,"PRIVATE")),(0,n.registerVersion)(a,u),(0,n.registerVersion)(a,u,"esm2017")},{"@firebase/app":217,"@firebase/component":218,"@firebase/util":223,"core-js/modules/es.array.includes.js":429,"core-js/modules/es.array.iterator.js":430,"core-js/modules/es.promise.js":437,"core-js/modules/es.regexp.exec.js":442,"core-js/modules/es.string.replace.js":445,"core-js/modules/es.typed-array.fill.js":447,"core-js/modules/es.typed-array.set.js":448,"core-js/modules/es.typed-array.sort.js":449,"core-js/modules/es.typed-array.uint8-array.js":450,"core-js/modules/web.dom-collections.iterator.js":453,idb:485}],220:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n,o,i=e("tslib"),s=[];
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */r.LogLevel=void 0,(o=r.LogLevel||(r.LogLevel={}))[o.DEBUG=0]="DEBUG",o[o.VERBOSE=1]="VERBOSE",o[o.INFO=2]="INFO",o[o.WARN=3]="WARN",o[o.ERROR=4]="ERROR",o[o.SILENT=5]="SILENT";var a={debug:r.LogLevel.DEBUG,verbose:r.LogLevel.VERBOSE,info:r.LogLevel.INFO,warn:r.LogLevel.WARN,error:r.LogLevel.ERROR,silent:r.LogLevel.SILENT},u=r.LogLevel.INFO,l=((n={})[r.LogLevel.DEBUG]="log",n[r.LogLevel.VERBOSE]="log",n[r.LogLevel.INFO]="info",n[r.LogLevel.WARN]="warn",n[r.LogLevel.ERROR]="error",n),c=function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];if(!(t<e.logLevel)){var o=(new Date).toISOString(),s=l[t];if(!s)throw new Error("Attempted to log a message with an invalid logType (value: ".concat(t,")"));console[s].apply(console,i.__spreadArray(["[".concat(o,"]  ").concat(e.name,":")],r,!1))}},d=function(){function e(e){this.name=e,this._logLevel=u,this._logHandler=c,this._userLogHandler=null,s.push(this)}return Object.defineProperty(e.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in r.LogLevel))throw new TypeError('Invalid value "'.concat(e,'" assigned to `logLevel`'));this._logLevel=e},enumerable:!1,configurable:!0}),e.prototype.setLogLevel=function(e){this._logLevel="string"==typeof e?a[e]:e},Object.defineProperty(e.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"userLogHandler",{get:function(){return this._userLogHandler},set:function(e){this._userLogHandler=e},enumerable:!1,configurable:!0}),e.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,i.__spreadArray([this,r.LogLevel.DEBUG],e,!1)),this._logHandler.apply(this,i.__spreadArray([this,r.LogLevel.DEBUG],e,!1))},e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,i.__spreadArray([this,r.LogLevel.VERBOSE],e,!1)),this._logHandler.apply(this,i.__spreadArray([this,r.LogLevel.VERBOSE],e,!1))},e.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,i.__spreadArray([this,r.LogLevel.INFO],e,!1)),this._logHandler.apply(this,i.__spreadArray([this,r.LogLevel.INFO],e,!1))},e.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,i.__spreadArray([this,r.LogLevel.WARN],e,!1)),this._logHandler.apply(this,i.__spreadArray([this,r.LogLevel.WARN],e,!1))},e.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,i.__spreadArray([this,r.LogLevel.ERROR],e,!1)),this._logHandler.apply(this,i.__spreadArray([this,r.LogLevel.ERROR],e,!1))},e}();r.Logger=d,r.setLogLevel=function(e){s.forEach((function(t){t.setLogLevel(e)}))},r.setUserLogHandler=function(e,t){for(var n=function(n){var o=null;t&&t.level&&(o=a[t.level]),n.userLogHandler=null===e?null:function(t,n){for(var i=[],s=2;s<arguments.length;s++)i[s-2]=arguments[s];var a=i.map((function(e){if(null==e)return null;if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(e){return null}})).filter((function(e){return e})).join(" ");n>=(null!=o?o:t.logLevel)&&e({level:r.LogLevel[n].toLowerCase(),message:a,args:i,type:t.name})}},o=0,i=s;o<i.length;o++){n(i[o])}}},{tslib:715}],221:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.deleteToken=function(e){
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return async function(e){if(!navigator)throw D.create("only-available-in-window");e.swRegistration||await H(e);return k(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e=(0,i.getModularInstance)(e))},r.getMessaging=
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e=(0,s.getApp)()){return J().then((e=>{if(!e)throw D.create("unsupported-browser")}),(e=>{throw D.create("indexed-db-unsupported")})),(0,s._getProvider)((0,i.getModularInstance)(e),"messaging").getImmediate()},r.getToken=async function(e,t){return W(e=(0,i.getModularInstance)(e),t)},r.isSupported=J,r.onMessage=function(e,t){return function(e,t){if(!navigator)throw D.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}(e=(0,i.getModularInstance)(e),t)},e("core-js/modules/es.array.includes.js"),e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/es.regexp.exec.js"),e("core-js/modules/es.string.replace.js"),e("core-js/modules/es.typed-array.uint8-array.js"),e("core-js/modules/es.typed-array.fill.js"),e("core-js/modules/es.typed-array.set.js"),e("core-js/modules/es.typed-array.sort.js"),e("core-js/modules/web.dom-collections.iterator.js"),e("@firebase/installations");var n=e("@firebase/component"),o=e("idb"),i=e("@firebase/util"),s=e("@firebase/app");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const a="/firebase-messaging-sw.js",u="/firebase-cloud-messaging-push-scope",l="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",c="https://fcmregistrations.googleapis.com/v1",d="google.c.a.c_id",f="google.c.a.c_l",p="google.c.a.ts";var h,_;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function E(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function g(e){const t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(t),n=new Uint8Array(r.length);for(let e=0;e<r.length;++e)n[e]=r.charCodeAt(e);return n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */!function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"}(h||(h={})),function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"}(_||(_={}));const m="fcm_token_details_db",y=5,S="fcm_token_object_Store";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const T="firebase-messaging-database",A=1,b="firebase-messaging-store";let O=null;function I(){return O||(O=(0,o.openDB)(T,A,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(b)}})),O}async function v(e){const t=C(e),r=await I(),n=await r.transaction(b).objectStore(b).get(t);if(n)return n;{const t=await async function(e){if("databases"in indexedDB){const e=(await indexedDB.databases()).map((e=>e.name));if(!e.includes(m))return null}let t=null;return(await(0,o.openDB)(m,y,{upgrade:async(r,n,o,i)=>{var s;if(n<2)return;if(!r.objectStoreNames.contains(S))return;const a=i.objectStore(S),u=await a.index("fcmSenderId").get(e);if(await a.clear(),u)if(2===n){const e=u;if(!e.auth||!e.p256dh||!e.endpoint)return;t={token:e.fcmToken,createTime:null!==(s=e.createTime)&&void 0!==s?s:Date.now(),subscriptionOptions:{auth:e.auth,p256dh:e.p256dh,endpoint:e.endpoint,swScope:e.swScope,vapidKey:"string"==typeof e.vapidKey?e.vapidKey:E(e.vapidKey)}}}else if(3===n){const e=u;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:E(e.auth),p256dh:E(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:E(e.vapidKey)}}}else if(4===n){const e=u;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:E(e.auth),p256dh:E(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:E(e.vapidKey)}}}}})).close(),await(0,o.deleteDB)(m),await(0,o.deleteDB)("fcm_vapid_details_db"),await(0,o.deleteDB)("undefined"),function(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}(t)?t:null}(e.appConfig.senderId);if(t)return await N(e,t),t}}async function N(e,t){const r=C(e),n=(await I()).transaction(b,"readwrite");return await n.objectStore(b).put(t,r),await n.done,t}function C({appConfig:e}){return e.appId}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},D=new i.ErrorFactory("messaging","Messaging",R);async function w(e,t){const r={method:"DELETE",headers:await P(e)};try{const n=await fetch(`${L(e.appConfig)}/${t}`,r),o=await n.json();if(o.error){const e=o.error.message;throw D.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw D.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function L({projectId:e}){return`${c}/projects/${e}/registrations`}async function P({appConfig:e,installations:t}){const r=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${r}`})}function M({p256dh:e,auth:t,endpoint:r,vapidKey:n}){const o={web:{endpoint:r,auth:t,p256dh:e}};return n!==l&&(o.web.applicationPubKey=n),o}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U=6048e5;async function j(e){const t=await async function(e,t){const r=await e.pushManager.getSubscription();if(r)return r;return e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:g(t)})}(e.swRegistration,e.vapidKey),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:E(t.getKey("auth")),p256dh:E(t.getKey("p256dh"))},n=await v(e.firebaseDependencies);if(n){if(function(e,t){const r=t.vapidKey===e.vapidKey,n=t.endpoint===e.endpoint,o=t.auth===e.auth,i=t.p256dh===e.p256dh;return r&&n&&o&&i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n.subscriptionOptions,r))return Date.now()>=n.createTime+U?async function(e,t){try{const r=await async function(e,t){const r=await P(e),n=M(t.subscriptionOptions),o={method:"PATCH",headers:r,body:JSON.stringify(n)};let i;try{const r=await fetch(`${L(e.appConfig)}/${t.token}`,o);i=await r.json()}catch(e){throw D.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(i.error){const e=i.error.message;throw D.create("token-update-failed",{errorInfo:e})}if(!i.token)throw D.create("token-update-no-token");return i.token}(e.firebaseDependencies,t),n=Object.assign(Object.assign({},t),{token:r,createTime:Date.now()});return await N(e.firebaseDependencies,n),r}catch(t){throw await k(e),t}}(e,{token:n.token,createTime:Date.now(),subscriptionOptions:r}):n.token;try{await w(e.firebaseDependencies,n.token)}catch(e){console.warn(e)}return x(e.firebaseDependencies,r)}return x(e.firebaseDependencies,r)}async function k(e){const t=await v(e.firebaseDependencies);t&&(await w(e.firebaseDependencies,t.token),await async function(e){const t=C(e),r=(await I()).transaction(b,"readwrite");await r.objectStore(b).delete(t),await r.done}(e.firebaseDependencies));const r=await e.swRegistration.pushManager.getSubscription();return!r||r.unsubscribe()}async function x(e,t){const r=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */await async function(e,t){const r=await P(e),n=M(t),o={method:"POST",headers:r,body:JSON.stringify(n)};let i;try{const t=await fetch(L(e.appConfig),o);i=await t.json()}catch(e){throw D.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(i.error){const e=i.error.message;throw D.create("token-subscribe-failed",{errorInfo:e})}if(!i.token)throw D.create("token-subscribe-no-token");return i.token}(e,t),n={token:r,createTime:Date.now(),subscriptionOptions:t};return await N(e,n),n.token}function B(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function(e,t){if(!t.notification)return;e.notification={};const r=t.notification.title;r&&(e.notification.title=r);const n=t.notification.body;n&&(e.notification.body=n);const o=t.notification.image;o&&(e.notification.image=o);const i=t.notification.icon;i&&(e.notification.icon=i)}(t,e),function(e,t){if(!t.data)return;e.data=t.data}(t,e),function(e,t){var r,n,o,i,s;if(!t.fcmOptions&&!(null===(r=t.notification)||void 0===r?void 0:r.click_action))return;e.fcmOptions={};const a=null!==(o=null===(n=t.fcmOptions)||void 0===n?void 0:n.link)&&void 0!==o?o:null===(i=t.notification)||void 0===i?void 0:i.click_action;a&&(e.fcmOptions.link=a);const u=null===(s=t.fcmOptions)||void 0===s?void 0:s.analytics_label;u&&(e.fcmOptions.analyticsLabel=u)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t,e),t}function F(e,t){const r=[];for(let n=0;n<e.length;n++)r.push(e.charAt(n)),n<t.length&&r.push(t.charAt(n));return r.join("")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(e){return D.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
F("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),F("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");class V{constructor(e,t,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const n=function(e){if(!e||!e.options)throw G("App Configuration Object");if(!e.name)throw G("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:r}=e;for(const e of t)if(!r[e])throw G(e);return{appName:e.name,projectId:r.projectId,apiKey:r.apiKey,appId:r.appId,senderId:r.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:n,installations:t,analyticsProvider:r}}_delete(){return Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H(e){try{e.swRegistration=await navigator.serviceWorker.register(a,{scope:u}),e.swRegistration.update().catch((()=>{}))}catch(e){throw D.create("failed-service-worker-registration",{browserErrorMessage:null==e?void 0:e.message})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function W(e,t){if(!navigator)throw D.create("only-available-in-window");if("default"===Notification.permission&&await Notification.requestPermission(),"granted"!==Notification.permission)throw D.create("permission-blocked");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return await async function(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=l)}(e,null==t?void 0:t.vapidKey),await async function(e,t){if(t||e.swRegistration||await H(e),t||!e.swRegistration){if(!(t instanceof ServiceWorkerRegistration))throw D.create("invalid-sw-registration");e.swRegistration=t}}(e,null==t?void 0:t.serviceWorkerRegistration),j(e)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y(e,t,r){const n=function(e){switch(e){case _.NOTIFICATION_CLICKED:return"notification_open";case _.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(n,{message_id:r[d],message_name:r[f],message_time:r[p],message_device_time:Math.floor(Date.now()/1e3)})}async function K(e,t){const r=t.data;if(!r.isFirebaseMessaging)return;e.onMessageHandler&&r.messageType===_.PUSH_RECEIVED&&("function"==typeof e.onMessageHandler?e.onMessageHandler(B(r)):e.onMessageHandler.next(B(r)));const n=r.data;var o;"object"==typeof(o=n)&&o&&d in o&&"1"===n["google.c.a.e"]&&await Y(e,r.messageType,n)}const z="@firebase/messaging",q="0.12.6",X=e=>{const t=new V(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",(e=>K(t,e))),t},$=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:e=>W(t,e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function J(){try{await(0,i.validateIndexedDBOpenable)()}catch(e){return!1}return"undefined"!=typeof window&&(0,i.isIndexedDBAvailable)()&&(0,i.areCookiesEnabled)()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}(0,s._registerComponent)(new n.Component("messaging",X,"PUBLIC")),(0,s._registerComponent)(new n.Component("messaging-internal",$,"PRIVATE")),(0,s.registerVersion)(z,q),(0,s.registerVersion)(z,q,"esm2017")},{"@firebase/app":217,"@firebase/component":218,"@firebase/installations":219,"@firebase/util":223,"core-js/modules/es.array.includes.js":429,"core-js/modules/es.array.iterator.js":430,"core-js/modules/es.promise.js":437,"core-js/modules/es.regexp.exec.js":442,"core-js/modules/es.string.replace.js":445,"core-js/modules/es.typed-array.fill.js":447,"core-js/modules/es.typed-array.set.js":448,"core-js/modules/es.typed-array.sort.js":449,"core-js/modules/es.typed-array.uint8-array.js":450,"core-js/modules/web.dom-collections.iterator.js":453,idb:485}],222:[function(e,t,r){"use strict";e("core-js/modules/es.array.includes.js"),e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/es.regexp.exec.js"),e("core-js/modules/es.string.replace.js"),e("core-js/modules/es.typed-array.uint8-array.js"),e("core-js/modules/es.typed-array.fill.js"),e("core-js/modules/es.typed-array.set.js"),e("core-js/modules/es.typed-array.sort.js"),e("core-js/modules/esnext.string.match-all.js"),e("core-js/modules/web.dom-collections.iterator.js"),e("core-js/modules/web.url.js"),e("core-js/modules/web.url-search-params.js"),Object.defineProperty(r,"__esModule",{value:!0}),e("@firebase/installations");var n,o,i=e("@firebase/component"),s=e("tslib"),a=e("idb"),u=e("@firebase/util"),l=e("@firebase/app"),c="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",d="https://fcmregistrations.googleapis.com/v1",f="FCM_MSG",p="google.c.a.c_id",h=3,_=1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function E(e){var t=new Uint8Array(e);return btoa(String.fromCharCode.apply(String,s.__spreadArray([],s.__read(t),!1))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function g(e){for(var t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(t),n=new Uint8Array(r.length),o=0;o<r.length;++o)n[o]=r.charCodeAt(o);return n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */!function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"}(n||(n={})),function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"}(o||(o={}));var m="fcm_token_details_db",y=5,S="fcm_token_object_Store";function T(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r,n,o=this;return s.__generator(this,(function(i){switch(i.label){case 0:return"databases"in indexedDB?[4,indexedDB.databases()]:[3,2];case 1:if(t=i.sent(),r=t.map((function(e){return e.name})),!r.includes(m))return[2,null];i.label=2;case 2:return n=null,[4,a.openDB(m,y,{upgrade:function(t,r,i,a){return s.__awaiter(o,void 0,void 0,(function(){var o,i,u,l;return s.__generator(this,(function(s){switch(s.label){case 0:return r<2?[2]:t.objectStoreNames.contains(S)?[4,(o=a.objectStore(S)).index("fcmSenderId").get(e)]:[2];case 1:return i=s.sent(),[4,o.clear()];case 2:if(s.sent(),!i)return[2];if(2===r){if(!(u=i).auth||!u.p256dh||!u.endpoint)return[2];n={token:u.fcmToken,createTime:null!==(l=u.createTime)&&void 0!==l?l:Date.now(),subscriptionOptions:{auth:u.auth,p256dh:u.p256dh,endpoint:u.endpoint,swScope:u.swScope,vapidKey:"string"==typeof u.vapidKey?u.vapidKey:E(u.vapidKey)}}}else(3===r||4===r)&&(n={token:(u=i).fcmToken,createTime:u.createTime,subscriptionOptions:{auth:E(u.auth),p256dh:E(u.p256dh),endpoint:u.endpoint,swScope:u.swScope,vapidKey:E(u.vapidKey)}});return[2]}}))}))}})];case 3:return i.sent().close(),[4,a.deleteDB(m)];case 4:return i.sent(),[4,a.deleteDB("fcm_vapid_details_db")];case 5:return i.sent(),[4,a.deleteDB("undefined")];case 6:return i.sent(),[2,A(n)?n:null]}}))}))}function A(e){if(!e||!e.subscriptionOptions)return!1;var t=e.subscriptionOptions;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var b,O="firebase-messaging-database",I=1,v="firebase-messaging-store",N=null;function C(){return N||(N=a.openDB(O,I,{upgrade:function(e,t){if(0===t)e.createObjectStore(v)}})),N}function R(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r,n;return s.__generator(this,(function(o){switch(o.label){case 0:return t=L(e),[4,C()];case 1:return[4,o.sent().transaction(v).objectStore(v).get(t)];case 2:return(r=o.sent())?[2,r]:[3,3];case 3:return[4,T(e.appConfig.senderId)];case 4:return(n=o.sent())?[4,D(e,n)]:[3,6];case 5:return o.sent(),[2,n];case 6:return[2]}}))}))}function D(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o;return s.__generator(this,(function(i){switch(i.label){case 0:return r=L(e),[4,C()];case 1:return n=i.sent(),[4,(o=n.transaction(v,"readwrite")).objectStore(v).put(t,r)];case 2:return i.sent(),[4,o.done];case 3:return i.sent(),[2,t]}}))}))}function w(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r,n;return s.__generator(this,(function(o){switch(o.label){case 0:return t=L(e),[4,C()];case 1:return r=o.sent(),[4,(n=r.transaction(v,"readwrite")).objectStore(v).delete(t)];case 2:return o.sent(),[4,n.done];case 3:return o.sent(),[2]}}))}))}function L(e){return e.appConfig.appId}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var P=((b={})["missing-app-config-values"]='Missing App configuration value: "{$valueName}"',b["only-available-in-window"]="This method is available in a Window context.",b["only-available-in-sw"]="This method is available in a service worker context.",b["permission-default"]="The notification permission was not granted and dismissed instead.",b["permission-blocked"]="The notification permission was not granted and blocked instead.",b["unsupported-browser"]="This browser doesn't support the API's required to use the Firebase SDK.",b["indexed-db-unsupported"]="This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",b["failed-service-worker-registration"]="We are unable to register the default service worker. {$browserErrorMessage}",b["token-subscribe-failed"]="A problem occurred while subscribing the user to FCM: {$errorInfo}",b["token-subscribe-no-token"]="FCM returned no token when subscribing the user to push.",b["token-unsubscribe-failed"]="A problem occurred while unsubscribing the user from FCM: {$errorInfo}",b["token-update-failed"]="A problem occurred while updating the user from FCM: {$errorInfo}",b["token-update-no-token"]="FCM returned no token when updating the user to push.",b["use-sw-after-get-token"]="The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",b["invalid-sw-registration"]="The input to useServiceWorker() must be a ServiceWorkerRegistration.",b["invalid-bg-handler"]="The input to setBackgroundMessageHandler() must be a function.",b["invalid-vapid-key"]="The public VAPID key must be a string.",b["use-vapid-key-after-get-token"]="The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",b),M=new u.ErrorFactory("messaging","Messaging",P);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function U(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o,i,a,u;return s.__generator(this,(function(s){switch(s.label){case 0:return[4,B(e)];case 1:r=s.sent(),n=F(t),o={method:"POST",headers:r,body:JSON.stringify(n)},s.label=2;case 2:return s.trys.push([2,5,,6]),[4,fetch(x(e.appConfig),o)];case 3:return[4,s.sent().json()];case 4:return i=s.sent(),[3,6];case 5:throw a=s.sent(),M.create("token-subscribe-failed",{errorInfo:null==a?void 0:a.toString()});case 6:if(i.error)throw u=i.error.message,M.create("token-subscribe-failed",{errorInfo:u});if(!i.token)throw M.create("token-subscribe-no-token");return[2,i.token]}}))}))}function j(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o,i,a,u;return s.__generator(this,(function(s){switch(s.label){case 0:return[4,B(e)];case 1:r=s.sent(),n=F(t.subscriptionOptions),o={method:"PATCH",headers:r,body:JSON.stringify(n)},s.label=2;case 2:return s.trys.push([2,5,,6]),[4,fetch("".concat(x(e.appConfig),"/").concat(t.token),o)];case 3:return[4,s.sent().json()];case 4:return i=s.sent(),[3,6];case 5:throw a=s.sent(),M.create("token-update-failed",{errorInfo:null==a?void 0:a.toString()});case 6:if(i.error)throw u=i.error.message,M.create("token-update-failed",{errorInfo:u});if(!i.token)throw M.create("token-update-no-token");return[2,i.token]}}))}))}function k(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o,i,a;return s.__generator(this,(function(s){switch(s.label){case 0:return[4,B(e)];case 1:r=s.sent(),n={method:"DELETE",headers:r},s.label=2;case 2:return s.trys.push([2,5,,6]),[4,fetch("".concat(x(e.appConfig),"/").concat(t),n)];case 3:return[4,s.sent().json()];case 4:if((o=s.sent()).error)throw i=o.error.message,M.create("token-unsubscribe-failed",{errorInfo:i});return[3,6];case 5:throw a=s.sent(),M.create("token-unsubscribe-failed",{errorInfo:null==a?void 0:a.toString()});case 6:return[2]}}))}))}function x(e){var t=e.projectId;return"".concat(d,"/projects/").concat(t,"/registrations")}function B(e){var t=e.appConfig,r=e.installations;return s.__awaiter(this,void 0,void 0,(function(){var e;return s.__generator(this,(function(n){switch(n.label){case 0:return[4,r.getToken()];case 1:return e=n.sent(),[2,new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":"FIS ".concat(e)})]}}))}))}function F(e){var t=e.p256dh,r=e.auth,n=e.endpoint,o=e.vapidKey,i={web:{endpoint:n,auth:r,p256dh:t}};return o!==c&&(i.web.applicationPubKey=o),i}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G=6048e5;function V(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r,n,o;return s.__generator(this,(function(i){switch(i.label){case 0:return[4,K(e.swRegistration,e.vapidKey)];case 1:return t=i.sent(),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:E(t.getKey("auth")),p256dh:E(t.getKey("p256dh"))},[4,R(e.firebaseDependencies)];case 2:return(n=i.sent())?[3,3]:[2,Y(e.firebaseDependencies,r)];case 3:if(s=n.subscriptionOptions,u=(a=r).vapidKey===s.vapidKey,l=a.endpoint===s.endpoint,c=a.auth===s.auth,d=a.p256dh===s.p256dh,u&&l&&c&&d)return[3,8];i.label=4;case 4:return i.trys.push([4,6,,7]),[4,k(e.firebaseDependencies,n.token)];case 5:return i.sent(),[3,7];case 6:return o=i.sent(),console.warn(o),[3,7];case 7:return[2,Y(e.firebaseDependencies,r)];case 8:return Date.now()>=n.createTime+G?[2,W(e,{token:n.token,createTime:Date.now(),subscriptionOptions:r})]:[2,n.token];case 9:return[2]}var s,a,u,l,c,d;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}))}))}function H(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r;return s.__generator(this,(function(n){switch(n.label){case 0:return[4,R(e.firebaseDependencies)];case 1:return(t=n.sent())?[4,k(e.firebaseDependencies,t.token)]:[3,4];case 2:return n.sent(),[4,w(e.firebaseDependencies)];case 3:n.sent(),n.label=4;case 4:return[4,e.swRegistration.pushManager.getSubscription()];case 5:return(r=n.sent())?[2,r.unsubscribe()]:[2,!0]}}))}))}function W(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o;return s.__generator(this,(function(i){switch(i.label){case 0:return i.trys.push([0,3,,5]),[4,j(e.firebaseDependencies,t)];case 1:return r=i.sent(),n=s.__assign(s.__assign({},t),{token:r,createTime:Date.now()}),[4,D(e.firebaseDependencies,n)];case 2:return i.sent(),[2,r];case 3:return o=i.sent(),[4,H(e)];case 4:throw i.sent(),o;case 5:return[2]}}))}))}function Y(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n;return s.__generator(this,(function(o){switch(o.label){case 0:return[4,U(e,t)];case 1:return r=o.sent(),n={token:r,createTime:Date.now(),subscriptionOptions:t},[4,D(e,n)];case 2:return o.sent(),[2,n.token]}}))}))}function K(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r;return s.__generator(this,(function(n){switch(n.label){case 0:return[4,e.pushManager.getSubscription()];case 1:return(r=n.sent())?[2,r]:[2,e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:g(t)})]}}))}))}function z(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o;return s.__generator(this,(function(i){switch(i.label){case 0:return n=q,o=[t],[4,e.firebaseDependencies.installations.getId()];case 1:return r=n.apply(void 0,o.concat([i.sent()])),function(e,t,r){var n={};n.event_time_ms=Math.floor(Date.now()).toString(),n.source_extension_json_proto3=JSON.stringify(t),!r||(n.compliance_data=function(e){var t={privacy_context:{prequest:{origin_associated_product_id:e}}};return t}(r));e.logEvents.push(n)}(e,r,t.productId),[2]}}))}))}function q(e,t){var r,o,i={};return e.from&&(i.project_number=e.from),e.fcmMessageId&&(i.message_id=e.fcmMessageId),i.instance_id=t,e.notification?i.message_type=n.DISPLAY_NOTIFICATION.toString():i.message_type=n.DATA_MESSAGE.toString(),i.sdk_platform=h.toString(),i.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),e.collapse_key&&(i.collapse_key=e.collapse_key),i.event=_.toString(),(null===(r=e.fcmOptions)||void 0===r?void 0:r.analytics_label)&&(i.analytics_label=null===(o=e.fcmOptions)||void 0===o?void 0:o.analytics_label),i}function X(e,t){for(var r=[],n=0;n<e.length;n++)r.push(e.charAt(n)),n<t.length&&r.push(t.charAt(n));return r.join("")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(e){var t,r;return s.__awaiter(this,void 0,void 0,(function(){var n,i,a,u,l;return s.__generator(this,(function(s){switch(s.label){case 0:return(n=null===(r=null===(t=e.notification)||void 0===t?void 0:t.data)||void 0===r?void 0:r[f])?e.action?[2]:(e.stopImmediatePropagation(),e.notification.close(),i=function(e){var t,r,n,o=null!==(r=null===(t=e.fcmOptions)||void 0===t?void 0:t.link)&&void 0!==r?r:null===(n=e.notification)||void 0===n?void 0:n.click_action;if(o)return o;return i=e.data,"object"==typeof i&&i&&p in i?self.location.origin:null;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var i;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n),i?(a=new URL(i,self.location.href),u=new URL(self.location.origin),a.host!==u.host?[2]:[4,Z(a)]):[2]):[2];case 1:return(l=s.sent())?[3,4]:[4,self.clients.openWindow(i)];case 2:return l=s.sent(),[4,(c=3e3,new Promise((function(e){setTimeout(e,c)})))];case 3:return s.sent(),[3,6];case 4:return[4,l.focus()];case 5:l=s.sent(),s.label=6;case 6:return l?(n.messageType=o.NOTIFICATION_CLICKED,n.isFirebaseMessaging=!0,[2,l.postMessage(n)]):[2]}var c;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}))}))}function J(e){var t,r=s.__assign({},e.notification);return r.data=((t={})[f]=e,t),r}function Z(e){return s.__awaiter(this,void 0,void 0,(function(){var t,r,n,o,i,a,u;return s.__generator(this,(function(l){switch(l.label){case 0:return[4,ee()];case 1:t=l.sent();try{for(r=s.__values(t),n=r.next();!n.done;n=r.next())if(o=n.value,i=new URL(o.url,self.location.href),e.host===i.host)return[2,o]}catch(e){a={error:e}}finally{try{n&&!n.done&&(u=r.return)&&u.call(r)}finally{if(a)throw a.error}}return[2,null]}}))}))}function Q(e,t){var r,n;t.isFirebaseMessaging=!0,t.messageType=o.PUSH_RECEIVED;try{for(var i=s.__values(e),a=i.next();!a.done;a=i.next()){a.value.postMessage(t)}}catch(e){r={error:e}}finally{try{a&&!a.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}}function ee(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function te(e){var t,r=e.actions,n=Notification.maxActions;return r&&n&&r.length>n&&console.warn("This browser only supports ".concat(n," actions. The remaining actions will not be displayed.")),self.registration.showNotification(null!==(t=e.title)&&void 0!==t?t:"",e)}function re(e){return M.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */X("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),X("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");var ne=function(){function e(e,t,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;var n=function(e){var t,r;if(!e||!e.options)throw re("App Configuration Object");if(!e.name)throw re("App Name");var n=e.options;try{for(var o=s.__values(["projectId","apiKey","appId","messagingSenderId"]),i=o.next();!i.done;i=o.next()){var a=i.value;if(!n[a])throw re(a)}}catch(e){t={error:e}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:n,installations:t,analyticsProvider:r}}return e.prototype._delete=function(){return Promise.resolve()},e}(),oe=function(e){var t=new ne(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return self.addEventListener("push",(function(e){e.waitUntil(function(e,t){return s.__awaiter(this,void 0,void 0,(function(){var r,n,o;return s.__generator(this,(function(i){switch(i.label){case 0:return r=function(e){var t=e.data;if(!t)return null;try{return t.json()}catch(e){return null}}(e),r?t.deliveryMetricsExportedToBigQueryEnabled?[4,z(t,r)]:[3,2]:[2];case 1:i.sent(),i.label=2;case 2:return[4,ee()];case 3:return function(e){return e.some((function(e){return"visible"===e.visibilityState&&!e.url.startsWith("chrome-extension://")}))}(n=i.sent())?[2,Q(n,r)]:r.notification?[4,te(J(r))]:[3,5];case 4:i.sent(),i.label=5;case 5:return t?t.onBackgroundMessageHandler?(o=function(e){var t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function(e,t){if(t.notification){e.notification={};var r=t.notification.title;r&&(e.notification.title=r);var n=t.notification.body;n&&(e.notification.body=n);var o=t.notification.image;o&&(e.notification.image=o);var i=t.notification.icon;i&&(e.notification.icon=i)}}(t,e),function(e,t){t.data&&(e.data=t.data)}(t,e),function(e,t){var r,n,o,i,s;if(t.fcmOptions||(null===(r=t.notification)||void 0===r?void 0:r.click_action)){e.fcmOptions={};var a=null!==(o=null===(n=t.fcmOptions)||void 0===n?void 0:n.link)&&void 0!==o?o:null===(i=t.notification)||void 0===i?void 0:i.click_action;a&&(e.fcmOptions.link=a);var u=null===(s=t.fcmOptions)||void 0===s?void 0:s.analytics_label;u&&(e.fcmOptions.analyticsLabel=u)}}(t,e),t}(r),"function"!=typeof t.onBackgroundMessageHandler?[3,7]:[4,t.onBackgroundMessageHandler(o)]):[3,8]:[2];case 6:return i.sent(),[3,8];case 7:t.onBackgroundMessageHandler.next(o),i.label=8;case 8:return[2]}}))}))}(e,t))})),self.addEventListener("pushsubscriptionchange",(function(e){e.waitUntil(function(e,t){var r,n;return s.__awaiter(this,void 0,void 0,(function(){var o;return s.__generator(this,(function(i){switch(i.label){case 0:return e.newSubscription?[3,2]:[4,H(t)];case 1:case 5:return i.sent(),[2];case 2:return[4,R(t.firebaseDependencies)];case 3:return o=i.sent(),[4,H(t)];case 4:return i.sent(),t.vapidKey=null!==(n=null===(r=null==o?void 0:o.subscriptionOptions)||void 0===r?void 0:r.vapidKey)&&void 0!==n?n:c,[4,V(t)]}}))}))}(e,t))})),self.addEventListener("notificationclick",(function(e){e.waitUntil($(e))})),t};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ie(){return s.__awaiter(this,void 0,void 0,(function(){var e;return s.__generator(this,(function(t){switch(t.label){case 0:return(e=u.isIndexedDBAvailable())?[4,u.validateIndexedDBOpenable()]:[3,2];case 1:e=t.sent(),t.label=2;case 2:return[2,e&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")]}}))}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */l._registerComponent(new i.Component("messaging-sw",oe,"PUBLIC")),r.experimentalSetDeliveryMetricsExportedToBigQueryEnabled=function(e,t){
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return function(e,t){e.deliveryMetricsExportedToBigQueryEnabled=t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e=u.getModularInstance(e),t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.getMessaging=function(e){return void 0===e&&(e=l.getApp()),ie().then((function(e){if(!e)throw M.create("unsupported-browser")}),(function(e){throw M.create("indexed-db-unsupported")})),l._getProvider(u.getModularInstance(e),"messaging-sw").getImmediate()},r.isSupported=ie,r.onBackgroundMessage=function(e,t){return function(e,t){if(void 0!==self.document)throw M.create("only-available-in-sw");return e.onBackgroundMessageHandler=t,function(){e.onBackgroundMessageHandler=null}}(e=u.getModularInstance(e),t)}},{"@firebase/app":217,"@firebase/component":218,"@firebase/installations":219,"@firebase/util":223,"core-js/modules/es.array.includes.js":429,"core-js/modules/es.array.iterator.js":430,"core-js/modules/es.promise.js":437,"core-js/modules/es.regexp.exec.js":442,"core-js/modules/es.string.replace.js":445,"core-js/modules/es.typed-array.fill.js":447,"core-js/modules/es.typed-array.set.js":448,"core-js/modules/es.typed-array.sort.js":449,"core-js/modules/es.typed-array.uint8-array.js":450,"core-js/modules/esnext.string.match-all.js":452,"core-js/modules/web.dom-collections.iterator.js":453,"core-js/modules/web.url-search-params.js":455,"core-js/modules/web.url.js":457,idb:485,tslib:715}],223:[function(e,t,r){(function(t,n){(function(){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.Sha1=r.RANDOM_FACTOR=r.MAX_VALUE_MILLIS=r.FirebaseError=r.ErrorFactory=r.Deferred=r.DecodeBase64StringError=r.CONSTANTS=void 0,r.areCookiesEnabled=function(){if("undefined"==typeof navigator||!navigator.cookieEnabled)return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.assertionError=r.assert=void 0,r.async=function(e,t){return(...r)=>{Promise.resolve(!0).then((()=>{e(...r)})).catch((e=>{t&&t(e)}))}},r.base64urlEncodeWithoutPadding=r.base64Encode=r.base64Decode=r.base64=void 0,r.calculateBackoffMillis=function(e,t=R,r=D){const n=t*Math.pow(r,e),o=Math.round(L*n*(Math.random()-.5)*2);return Math.min(w,n+o)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.contains=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.createMockUserToken=function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const r=t||"demo-project",n=e.iat||0,o=e.sub||e.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const i=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:n,exp:n+3600,auth_time:n,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},e);return[d(JSON.stringify({alg:"none",type:"JWT"})),d(JSON.stringify(i)),""].join(".")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.createSubscribe=function(e,t){const r=new v(e,t);return r.subscribe.bind(r)},r.decode=void 0,r.deepCopy=function(e){return p(void 0,e)},r.deepEqual=function e(t,r){if(t===r)return!0;const n=Object.keys(t),o=Object.keys(r);for(const i of n){if(!o.includes(i))return!1;const n=t[i],s=r[i];if(I(n)&&I(s)){if(!e(n,s))return!1}else if(n!==s)return!1}for(const e of o)if(!n.includes(e))return!1;return!0},r.deepExtend=p,r.errorPrefix=C,r.extractQuerystring=function(e){const t=e.indexOf("?");if(!t)return"";const r=e.indexOf("#",t);return e.substring(t,r>0?r:void 0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.getExperimentalSetting=r.getDefaults=r.getDefaultEmulatorHostnameAndPort=r.getDefaultEmulatorHost=r.getDefaultAppConfig=void 0,r.getGlobal=h,r.getModularInstance=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){return e&&e._delegate?e._delegate:e},r.getUA=m,r.isAdmin=void 0,r.isBrowser=function(){return"object"==typeof self&&self.self===self},r.isBrowserExtension=function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id},r.isElectron=function(){return m().indexOf("Electron/")>=0},r.isEmpty=function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0},r.isIE=function(){const e=m();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0},r.isIndexedDBAvailable=function(){try{return"object"==typeof indexedDB}catch(e){return!1}},r.isMobileCordova=function(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(m())},r.isNode=y,r.isNodeSdk=function(){return!0===o.NODE_CLIENT||!0===o.NODE_ADMIN},r.isReactNative=function(){return"object"==typeof navigator&&"ReactNative"===navigator.product},r.isSafari=function(){return!y()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")},r.isUWP=function(){return m().indexOf("MSAppHost/")>=0},r.issuedAtTime=r.isValidTimestamp=r.isValidFormat=void 0,r.jsonEval=b,r.map=function(e,t,r){const n={};for(const o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=t.call(r,e[o],o,e));return n},r.ordinal=function(e){if(!Number.isFinite(e))return`${e}`;return e+function(e){e=Math.abs(e);const t=e%100;if(t>=10&&t<=20)return"th";const r=e%10;if(1===r)return"st";if(2===r)return"nd";if(3===r)return"rd";return"th"}(e)},r.promiseWithTimeout=
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t=2e3){const r=new g;return setTimeout((()=>r.reject("timeout!")),t),e.then(r.resolve,r.reject),r.promise}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.querystring=function(e){const t=[];for(const[r,n]of Object.entries(e))Array.isArray(n)?n.forEach((e=>{t.push(encodeURIComponent(r)+"="+encodeURIComponent(e))})):t.push(encodeURIComponent(r)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""},r.querystringDecode=function(e){const t={},r=e.replace(/^\?/,"").split("&");return r.forEach((e=>{if(e){const[r,n]=e.split("=");t[decodeURIComponent(r)]=decodeURIComponent(n)}})),t},r.safeGet=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0},r.stringToByteArray=r.stringLength=void 0,r.stringify=function(e){return JSON.stringify(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.validateArgCount=r.uuidv4=void 0,r.validateCallback=function(e,t,r,n){if(n&&!r)return;if("function"!=typeof r)throw new Error(C(e,t)+"must be a valid function.")},r.validateContextObject=function(e,t,r,n){if(n&&!r)return;if("object"!=typeof r||null===r)throw new Error(C(e,t)+"must be a valid context object.")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,r.validateIndexedDBOpenable=function(){return new Promise(((e,t)=>{try{let r=!0;const n="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(n);o.onsuccess=()=>{o.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},o.onupgradeneeded=()=>{r=!1},o.onerror=()=>{var e;t((null===(e=o.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}}))},r.validateNamespace=function(e,t,r){if(r&&!t)return;if("string"!=typeof t)throw new Error(C(e,"namespace")+"must be a valid firebase namespace.")},e("core-js/modules/es.array.includes.js"),e("core-js/modules/es.array.iterator.js"),e("core-js/modules/es.promise.js"),e("core-js/modules/es.regexp.exec.js"),e("core-js/modules/es.string.replace.js"),e("core-js/modules/web.dom-collections.iterator.js");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const o=r.CONSTANTS={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"},i=function(e,t){if(!e)throw s(t)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */r.assert=i;const s=function(e){return new Error("Firebase Database ("+o.SDK_VERSION+") INTERNAL ASSERT FAILED: "+e)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
/**
 * @license
 *