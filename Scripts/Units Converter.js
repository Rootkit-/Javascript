// ==UserScript==
// @name         Units Converter
// @namespace    https://greasyfork.org/en/users/670188-hacker09
// @version      1
// @description  A library for unit conversions.
// @author       hacker09
// @grant        none
// ==/UserScript==

// Create the UConv map
window.UConv = {};

// Helper function to add conversions
function addConversion(keys, unit, factor, convert) {
  keys.forEach(key => {
    UConv[key.toLowerCase()] = { unit, factor, convert };
  });
}

// Add all conversions
addConversion(['inch', 'inches', 'in', '"', '”', '″'], 'cm', 2.54);
addConversion(['centimeter', 'centimeters', 'cm', 'cms'], 'in', 1 / 2.54);
addConversion(['meter', 'meters', 'm', 'mt', 'mts'], 'ft', 3.281);
addConversion(['kilogram', 'kilograms', 'kg'], 'lb', 2.205);
addConversion(['pound', 'pounds', 'lb', 'lbs'], 'kg', 1 / 2.205);
addConversion(['ounce', 'ounces', 'oz', 'ozs'], 'g', 28.35);
addConversion(['gram', 'grams', 'g'], 'oz', 1 / 28.35);
addConversion(['kilometer', 'kilometers', 'km'], 'mi', 1 / 1.609);
addConversion(['kph', 'kphs', 'km/h', 'km/hs', 'kilometers per hour', 'kilometers per hours'], 'mph', 0.621371);
addConversion(['mph', 'mphs', 'meters per hour', 'meters per hours'], 'km/h', 1.609);
addConversion(['mi', 'mile', 'miles'], 'km', 1.609);
addConversion(['°c', 'ºc', 'celsius', 'degrees celsius', '° celsius', 'º celsius'], '°F', null, v => (v * 9 / 5) + 32);
addConversion(['°f', 'ºf', 'fahrenheit', 'degrees fahrenheit', '° fahrenheit', 'º fahrenheit'], '°C', null, v => (v - 32) * 5 / 9);
addConversion(['milliliter', 'milliliters', 'ml'], 'fl oz (US)', 1 / 29.574);
addConversion(['fl oz (US)', 'fl oz', 'fl', 'fluid ounce', 'fluid ounces'], 'ml', 29.574);
addConversion(['litre', 'liter', 'litres', 'liters', 'l'], 'gal (US)', 1 / 3.785);
addConversion(['gal', 'gallon', 'gallons'], 'l', 3.785);
addConversion(['yard', 'yards', 'yd'], 'm', 1 / 1.094);
addConversion(['millimetre', 'millimeters', 'millimetres', 'mm'], 'in', 1 / 25.4);
addConversion(['feet', 'feets', 'ft'], 'm', 0.3048);
addConversion(['kilowatt', 'kilowatts', 'kw', 'kws'], 'hp', 1.341);
addConversion(['mhp', 'mhps', 'hp', 'hps', 'brake horsepower', 'mechanical horsepower'], 'kW', 1 / 1.341);
addConversion(['mpg', 'mpgs', 'miles per gallon', 'miles per gallons'], 'l/100km', null, v => 235.215 / v);
addConversion(['l/100km', 'lt/100km', 'liters per 100 kilometer', 'liters per 100 kilometers'], 'mpg (US)', null, v => 235.215 / v);
addConversion(['qt', 'lq', 'lqs', 'liquid quart', 'liquid quarts'], 'l', 1 / 1.057);
addConversion(['foot-pound', 'foot-pounds', 'foot pound', 'foot pounds', 'ft-lbs', 'ft-lb', 'ft lbs', 'ft lb', 'lb ft', 'lb-ft'], 'Nm', 1.3558179483);
addConversion(['nm', 'n·m', 'newton-meter', 'newton-meters', 'newton meter', 'newton meters'], 'lbf ft', 1 / 1.3558179483);