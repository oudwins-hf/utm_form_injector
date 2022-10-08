const forms = Array.from(document.querySelectorAll("form"));

if (forms) {
  const dataToInject = getDataToInject();
  forms.forEach((form) => injectDataSet(form, dataToInject));
}

function injectDataSet(form, dataset) {
  // Selects input field whose label content matches the key in the dataset
  const labels = Array.from(form.querySelectorAll("label"));
  for (const [key, value] of Object.entries(dataset)) {
    try {
      // THIS MAY FIND A MATCH OR NOT
      const label = labels.find((el) => getHtmlText(el) === key);
      if (!label) continue;
      document.getElementById(label.getAttribute("for")).value = value;
    } catch (swallow) {}
  }
}

function getHtmlText(el) {
  return el.innerText || el.textContent;
}

// returns object key value pairs
function getDataToInject() {
  // this is what each traffic source data point is called inside the cookie
  const mapping = {
    utmccn: "CAMPAIGN",
    utmcsr: "SOURCE",
    utmcmd: "MEDIUM",
    utmcct: "CONTENT",
  };
  // this is the name of the cookies, the mapping it should use to convert & the prefix it should use. Prefix is optional
  const cookiesToGet = [
    {
      name: "initialTrafficSource",
      mapping,
      mappingPrefix: "F_",
    },
    {
      name: "LastTrafficSource",
      mapping,
      mappingPrefix: "L_",
    },
  ];

  if (cookiesToGet)
    return cookiesToGet.reduce((acc, c) => {
      try {
        const obj = str_obj(getCookie(c.name));
        return {
          ...acc,
          ...formatDataObj(obj, c.mapping, c.mappingPrefix),
        };
      } catch (swallow) {
        return acc;
      }
    }, {});
  return;
}

// helps getDataToInject
function formatDataObj(dataset, mappingObj, prefix) {
  const formatedObj = {};
  for (const [key, value] of Object.entries(dataset)) {
    if (mappingObj[key])
      formatedObj[`${prefix ? prefix : ""}${mappingObj[key]}`] = value;
  }
  return formatedObj;
}
// helps getDataToInject
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
// helps getDataToInject
function str_obj(str) {
  str = str.split("|");
  var result = {};
  for (var i = 0; i < str.length; i++) {
    var cur = str[i].split("=");
    result[cur[0]] = cur[1];
  }
  return result;
}
