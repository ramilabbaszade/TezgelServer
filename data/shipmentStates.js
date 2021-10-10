export const trackingStates = [
    'URL_LINK',
    'ANNOUNCED', // Musteri onceden beyan etdi
    'RECEIVED', // Istanbul tehvil aldi
    'CREATED', // Musteri bizim saytda Shipment create etdi
    'CANCELLED', // Iptal edildi
    'PACKED', // Kolilendi -> Add to box edilir, kagiz uzerinde reg numberlar cixir yapisdirilir koliye
    'ON_WAY', // Yola dusdu -> Depesh artirilir, AWB yazilir
    'CUSTOMS_CLEARANCE', // Gomruk yoxlanisi
    'CUSTOMS_REJECTED', // Gomruk yoxlanisindan kecmedi
    'SORTING', // Cesidleme
    'IN_BRANCH', // Tehvil menteqesinde
    'DELIVERED' // Delivery ID generated -> Delivery options (Standard, Express, ...)
];

// Order states
// created, 
// payment_rejected (new Debt(inComplete payment )), 
// 

export const urlOrder = [
    'URL_LINK',
    'ANNOUNCED', // Musteri onceden beyan etdi
    'RECEIVED', // Istanbul tehvil aldi
    'CREATED', // Musteri bizim saytda Shipment create etdi
    'CANCELLED', // Iptal edildi
    'PACKED', // Kolilendi -> Add to box edilir, kagiz uzerinde reg numberlar cixir yapisdirilir koliye
    'ON_WAY', // Yola dusdu -> Depesh artirilir, AWB yazilir
    'CUSTOMS_CLEARANCE', // Gomruk yoxlanisi
    'CUSTOMS_REJECTED', // Gomruk yoxlanisindan kecmedi
    'SORTING', // Cesidleme
    'IN_BRANCH', // Tehvil menteqesinde
    'DELIVERED' // Delivery ID generated -> Delivery options (Standard, Express, ...)
];
