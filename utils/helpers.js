export const makePinCode = (length, numeric = false) => {
  var result = '';
  var characters = numeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


export const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", { timeZone: "Asia/Baku" });

export const formatPercentage = (percentage) => `%${percentage * 100}`;

export const formatBool = (data) => (data ? "Bəli" : "Xeyir");

export const formatPrice = (currency) =>
  new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


export const isIterableArray = array => Array.isArray(array) && !!array.length;

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const getSortObjs = sort => {
  if (!sort) return {};
  let sortObjs = [];
  let sortObjStrings = sort.split(',');
  if (isIterableArray(sortObjStrings)) {
    sortObjs = sortObjStrings.map(sortObjString => sortObjString.split(':'));
    return Object.fromEntries(sortObjs);
  }
  return convertArrayToObject(sortObjs)
}

export const getSearchObjs = search => {
  if (!search) return {};
  let sortObjs = [];
  let sortObjStrings = search.split(',');
  if (isIterableArray(sortObjStrings)) {
    sortObjs = sortObjStrings.map(sortObjString => {
      sortObjString = sortObjString.split(':');
      sortObjString[1] = sortObjString[0].includes('Id') || sortObjString[0].includes('status') || sortObjString[0].includes('type') ? sortObjString[1] : { $regex: sortObjString[1] }
      return sortObjString;
    });
    return Object.fromEntries(sortObjs);
  }
  return convertArrayToObject(sortObjs)
}

const getZeros = count => {
  let i = 0;
  let zeros = '';
  while (i < count) {
    zeros += '0';
    i++;
  }
  return zeros;
}

export const generateBoxBarcode = box => {
  const boxId = box.boxId.toString();
  const shipmentCount = box.shipments.length;
  const identifiers = `${shipmentCount}-${boxId}`;
  const zeros = getZeros(13 - identifiers.length)
  const barcode = `B${zeros}-${identifiers}`;
  return barcode;
}

export const generateShipmentBarcode = box => {
  const shipmentId = box.shipmentId.toString();
  const productCount = box.products.length;
  const identifiers = `${productCount}-${shipmentId}`;
  const zeros = getZeros(13 - identifiers.length)
  const barcode = `S${zeros}-${identifiers}`;
  return barcode;
}

export const validURL = (str) => {
  var pattern = new RegExp('^(http|https)://','i');
  return !!pattern.test(str);
}