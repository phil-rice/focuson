import { StringReplaceData } from "./Strings";

export const testString: string = 'test string';

export const jsonTestData: string = `
    {
        "_links" : {"_self": {"href": "api/filterList/filterList1"}},
        "_render": {"_self": "#Cpq/render#"},
        "price": "N/A ",
        "filters": [
            {
            "_render"    : {"_self": "#SimpleFilter/render#"},
            "filterName" : "filter.make",
            "selected"   : null,
            "legalValues": ["Tesla", "BMW", "Audi"]
            }, {
            "_render"    : {"_self": "#SimpleFilter/render#"},
            "filterName" : "filter.model",
            "selected"   : null,
            "legalValues": ["Audi A10", "BMW series 6", "Tesla Roadster"]
            }, {
            "_render"    : {"_self": "#GearboxFilter/render#"},
            "filterName" : "filter.transmission",
            "selected"   : null,
            "legalValues": ["Automatic", "Gearbox"]
            }, {
            "_render"    : {"_self": "#SimpleFilter/render#"},
            "filterName" : "filter.fuelType",
            "selected"   : null,
            "legalValues": ["Petrol", "Diesel", "Electric", "Benzene"]
            },
            
        ]
    }`;

export const jsonDataAfterReplacement: string = `
    {
        "_links" : {"_self": {"href": "api/filterList/filterList1"}},
        "_render": {"_self": "created/Cpq/477578688686797"},
        "price": "N/A ",
        "filters": [
            {
            "_render"    : {"_self": "created/SimpleFilter/d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b"},
            "filterName" : "filter.make",
            "selected"   : null,
            "legalValues": ["Tesla", "BMW", "Audi"]
            }, {
            "_render"    : {"_self": "created/SimpleFilter/d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b"},
            "filterName" : "filter.model",
            "selected"   : null,
            "legalValues": ["Audi A10", "BMW series 6", "Tesla Roadster"]
            }, {
            "_render"    : {"_self": "created/GearboxFilter/65465456979879676"},
            "filterName" : "filter.transmission",
            "selected"   : null,
            "legalValues": ["Automatic", "Gearbox"]
            }, {
            "_render"    : {"_self": "created/SimpleFilter/d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b"},
            "filterName" : "filter.fuelType",
            "selected"   : null,
            "legalValues": ["Petrol", "Diesel", "Electric", "Benzene"]
            },
            
        ]
    }`;

export const stringReplaceData: StringReplaceData[] = [
    { fromMatcher: new RegExp(`#SimpleFilter/render#`, 'gi'), to: `created/SimpleFilter/d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b` },
    { fromMatcher: new RegExp(`#GearboxFilter/render#`, 'gi'), to: `created/GearboxFilter/65465456979879676` },
    { fromMatcher: new RegExp(`#Nav/render#`, 'gi'), to: `created/Nav/2345156779879` },
    { fromMatcher: new RegExp(`#NavGroup/render#`, 'gi'), to: `created/NavGroup/767657657656576` },
    { fromMatcher: new RegExp(`#Cpq/render#`, 'gi'), to: `created/Cpq/477578688686797` }
];