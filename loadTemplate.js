
var MyObj = [];
var pluginIdval = {};
var secretKeyval = {};
var EntryUID = {};
var contentUID = {};
var emptytemplate = {};
window.addEventListener("message", (event) => {
    console.log(event);
    var jsondata = event.data;
    pluginIdval = jsondata.pluginId;
    secretKeyval = jsondata.secretKey;
    EntryUID = jsondata.EntryUID;
    contentUID = jsondata.contentUID;
    console.log(`pluginId is ${pluginIdval} secretKey is  ${secretKeyval}`);
    loadDemoTemplate(initPlugin);
});

// Utility methods
function request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            callback(req.responseText);
        } else if (req.readyState === 4 && req.status !== 200) {
            console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
        }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
        req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
}

function loademptytemplate() {

    return new Promise(function (resolve, reject) {
        var config = {
            method: 'get',
            url: 'https://api.contentstack.io/v3/content_types/' + contentUID + '/entries/' + EntryUID,
            headers: {
                'api_key': 'blt9c861b1a4b69e623',
                'authorization': 'cs263e09faa2d7347fa3b40394',
                'Content-Type': 'application/json',
            },
            //  data: contenttypebody
        };

        axios(config)
            .then(function (response) {
                console.log("Respone: ", response);
                resolve(response.data.entry.multi_line);
            }).catch(err => {
                console.log("error: ", err);
            })
    });
}
function reademptytemplateFile(file) {
    return new Promise(function (resolve, reject) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    resolve(allText);
                }
            }
        }
        rawFile.send(null);
    });
}

async function loadDemoTemplate(callback) {
    var html = "";
    html = await loademptytemplate()
    if (html == "" || html === undefined) {
        emptytemplate = await reademptytemplateFile("https://assets.contentstack.io/v3/assets/blt9c861b1a4b69e623/blt8cd1fefe9a5e5205/61978655f0aa502b90b53c04/Default_Stripo_template.txt")
        html = emptytemplate;
    }
    var css = "";
    callback({ html: html, css: css });
}

function Sendhtmlcodetos3(html) {
    const params = {
        TemplateName: "DemoTemplate",
        TemplateHtml: html
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(params)
    };
    fetch('https://amt0x2kkbl.execute-api.us-east-1.amazonaws.com/Prod/templatestore', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
        });
}
function initPlugin(template) {
    const apiRequestData = {
        emailId: 123
    };
    const script = document.createElement('script');
    script.id = 'stripoScript';
    script.type = 'text/javascript';
    script.src = 'https://plugins.stripo.email/static/latest/stripo.js';
    script.onload = function () {
        window.Stripo.init({

            mergeTags: MyObj,
            extensions: [{ globalName: 'DemoHeaderBlockExtension', url: 'https://tavisca-vvijayakumar.github.io/CustomBlock/main.extension.js' },
            { globalName: 'ProductBlockExtension', url: 'https://tavisca-vvijayakumar.github.io/ProductBlock/ProductBlock/main.extension_Product.js' }],
            productDemoBlock: {
                enabled: true,
                groups: [{
                    id: "group1",
                    name: "iPhone X",
                    count: 5
                },
                {
                    id: "group2",
                    name: "MacBook Pro",
                    count: 1
                }]
            },
            settingsId: 'stripoSettingsContainer',
            previewId: 'stripoPreviewContainer',
            codeEditorButtonId: 'codeEditor',
            undoButtonId: 'undoButton',
            redoButtonId: 'redoButton',
            locale: 'en',
            html: template.html,
            css: template.css,
            notifications: {
                info: notifications.info.bind(notifications),
                error: notifications.error.bind(notifications),
                warn: notifications.warn.bind(notifications),
                loader: notifications.loader.bind(notifications),
                hide: notifications.hide.bind(notifications),
                success: notifications.success.bind(notifications)
            },
            apiRequestData: apiRequestData,
            userFullName: 'Plugin Demo User',
            versionHistory: {
                changeHistoryLinkId: 'changeHistoryLink',
                onInitialized: function (lastChangeIndoText) {
                    $('#changeHistoryContainer').show();
                }
            },

            getAuthToken: function (callback) {
                request('POST', 'https://plugins.stripo.email/api/v1/auth',
                    JSON.stringify({
                        // pluginId: 'f7daf1549bed437488ed8c1fe92f3e20',
                        //secretKey: '6192a5b950614b5eb8ae05f20f395dec'
                        pluginId: pluginIdval,
                        secretKey: secretKeyval
                    }),
                    function (data) {
                        callback(JSON.parse(data).token);
                    });
            }
        });
    };
    document.body.appendChild(script);
}

function DownloadtoCMS(htmltext) {

    var Data = {
        "entry": {
            "custom": "",
            "multi_line": htmltext,
            "tags": [],
            "locale": "en-us"
        }
    };
    var config = {
        method: 'PUT',
        url: 'https://api.contentstack.io/v3/content_types/new_content_type_for_test/entries/' + EntryUID,
        headers: {
            'api_key': 'blt9c861b1a4b69e623',
            'authorization': 'cs263e09faa2d7347fa3b40394',
            'Content-Type': 'application/json',
        },
        data: Data
    };

    axios(config)
        .then(function (response) {
            console.log("Respone: ", response);
            alert("Entry has been updated successfully");
        }).catch(err => {
            console.log("error: ", err);
            alert("Entry failed");
        })

}

MyObj = [{
    "category": "Flight detail",
    "entries": [
        {
            "label": "Flight Name",
            "value": "air india",
        },
        {
            "label": "Flight Number",
            "value": "EK 345"
        },
        {
            "label": "Depart",
            "value": "10 0ct 21/10:30"
        },
        {
            "label": "Arrive",
            "value": "10 0ct 21/13:30"
        },

        {
            "label": "Airport/Terminal",
            "value": "Chennai/Terminal 1"
        },
    ]
},
{
    "category": "Hotel detail",
    "entries": [
        {
            "label": "Hotel Name",
            "value": "air india",
        },
        {
            "label": "Hotel Address",
            "value": "EK 345"
        },
        {
            "label": "Landmark",
            "value": "10 0ct 21/10:30"
        }
    ]
}]