import { createRulesetFunction } from '@stoplight/spectral-core';
import { hello } from '../test.js';

// Should Spectral return an error if unsupported properties are found
const ERROR_ON_UNSUPPORTED_PROPERTIES = true;

// Should Spectral ignore checks regarding "location" of the property
// (parent specific specifications (also if defined in a standard) are ignored)
const NO_PARENT_CHECK = new Set([
     //'CS_v1.0.0',
]);

// List of attributes to be checked
// For all attributes in ATTRIBUTES_TO_CHECK, this Spectral rule will make sure:
// * if attribute is in the Spec - the attribute MUST also be in the requirements
// * if attribute is in the requirements - then it also need to be in the Spec
const ATTRIBUTES_TO_CHECK= ['type', 'minLength', 'maxLength', 'pattern', 'enum', 'format', 'deprecated', 'exclusiveMaximum',
    'exclusiveMinimum', 'maximum', 'minimum', 'minItems', 'maxItems', 'required', 'nullable', 'items', 'title', 'additionalProperties', 'default'];

// List of Objects that must follow the CloudEvent Notification pattern
const DCSA_CLOUDEVENT_GROUP = { ShippingInstructionsNotification: {}, TransportDocumentNotification: {}, BookingNotification: {}, ArrivalNoticeNotification: {} };

// Spectral will **ONLY** check the standards in this list (in the future all APIs should be covered).
const COVERED_STANDARDS = new Set([
    // Arrival Notice
    'AN_v1.0.0-Beta-1',
    // Booking Notification
    'BKG_NTF_v2.0.0-Beta-2',
    
    'BKG_NTF_v2.0.0-Beta-3',
    // Booking
    'BKG_v2.0.0',
    'BKG_v2.0.0-Beta-2',
    'BKG_v2.0.0-Beta-3',
    // Commercial Schedules
    'CS_v1.0.0',
    // EBL Notification
    'EBL_NTF_v3.0.0-Beta-2',
    'EBL_NTF_v3.0.0-Beta-3',
    // EBL
    'EBL_v3.0.0',
    'EBL_v3.0.0-Beta-2', 'EBL_ISS_RSP_v3.0.0-Beta-2', 'EBL_SUR_RSP_v3.0.0-Beta-2',
    'EBL_v3.0.0-Beta-3', 'EBL_ISS_RSP_v3.0.0-Beta-3', 'EBL_SUR_RSP_v3.0.0-Beta-3',
    // EBL ISS
    'EBL_ISS_v3.0.0',
    'EBL_ISS_v3.0.0-Beta-2',
    'EBL_ISS_v3.0.0-Beta-3',
    // EBL SUR
    'EBL_SUR_v3.0.0',
    'EBL_SUR_v3.0.0-Beta-2',
    'EBL_SUR_v3.0.0-Beta-3',
    // PINT
    'EBL_PINT_v3.0.0',
    'EBL_PINT_v3.0.0-Beta-2',
    'EBL_PINT_v3.0.0-Beta-3',
]);

// Standard covering EBL Beta 2
const EBL_BETA2_GROUP = [ 'EBL_v2.0.0-Beta-2', 'EBL_ISS_v2.0.0-Beta-2', 'EBL_ISS_RSP_v2.0.0-Beta-2', 'EBL_SUR_v2.0.0-Beta-2', 'EBL_SUR_RSP_v2.0.0-Beta-2' ];

// A list of accepted properties that have changed over time or are different for different standards
// DEFAULT covers all remaining standards
// "GROUPS" - e.g. EBL_BETA2_GROUP: this covers all standards in the EBL Beta 2 release (EBL, ISS, ISS_RSP, SUR, SUR_RSP, EBL_NFT, PINT)
// - it is possible to define more groups in which the group need to be added next to where EBL_BETA2_GROUP is used
// If 'parent' is specified - then the spec only allows the property under the list of parents
// If no 'parent' is specified - the spec applies to all locations in the document
// parents-specs overrule "globalSpec"
// Enum and required fields (fields specified as lists) MUST be defined in same order
const DCSA_PROPERTIES = {
    action: {
        PARENTS            : { SurrenderRequestAnswer: {} },
        DEFAULT            : { type: 'string', enum: ['SURR', 'SREJ'] },
    },
    actionCode: {
        PARENTS            : { EndorsementChainLink: {} },
        DEFAULT            : { type: 'string', maxLength: 50 },
    },
    actionDateTime: {
        PARENTS            : { EndorsementChainLink: {} },
        DEFAULT            : { type: 'string', format: 'date-time' },
    },
    ActiveReeferSettings: {
        'BKG_v2.0.0'       : { DEFAULT: { required: ['temperatureSetpoint', 'temperatureUnit'], CHILDREN: ['temperatureSetpoint', 'temperatureUnit', 'o2Setpoint', 'co2Setpoint', 'humiditySetpoint', 'airExchangeSetpoint', 'airExchangeUnit', 'isVentilationOpen', 'isDrainholesOpen', 'isBulbMode', 'isColdTreatmentRequired', 'isControlledAtmosphereRequired', 'isPreCoolingRequired', 'isGeneratorSetRequired'] }, },
        'BKG_v2.0.0-Beta-2': { DEFAULT: { required: ['temperatureSetpoint', 'temperatureUnit'], CHILDREN: ['temperatureSetpoint', 'temperatureUnit', 'o2Setpoint', 'co2Setpoint', 'humiditySetpoint', 'airExchangeSetpoint', 'airExchangeUnit', 'isVentilationOpen', 'isDrainholesOpen', 'isBulbMode', 'isColdTreatmentRequired', 'isControlledAtmosphereRequired', 'isPreCoolingRequired', 'isGeneratorSetRequired'] }, },
        'BKG_v2.0.0-Beta-3': { DEFAULT: { required: ['temperatureSetpoint', 'temperatureUnit'], CHILDREN: ['temperatureSetpoint', 'temperatureUnit', 'o2Setpoint', 'co2Setpoint', 'humiditySetpoint', 'airExchangeSetpoint', 'airExchangeUnit', 'isVentilationOpen', 'isDrainholesOpen', 'isBulbMode', 'isColdTreatmentRequired', 'isControlledAtmosphereRequired', 'isPreCoolingRequired', 'isGeneratorSetRequired'] }, },
        DEFAULT            : { type: 'object', title: 'Active Reefer Settings', CHILDREN: ['temperatureSetpoint', 'temperatureUnit', 'o2Setpoint', 'co2Setpoint', 'humiditySetpoint', 'airExchangeSetpoint', 'airExchangeUnit', 'isVentilationOpen', 'isDrainholesOpen', 'isBulbMode', 'isColdTreatmentRequired', 'isControlledAtmosphereRequired'] },
    },
    activeReeferSettings: {
        PARENTS            : { RequestedEquipment: {}, RequestedEquipmentShipper: {}, UtilizedTransportEquipmentCarrier: {}, UtilizedTransportEquipment: {} },
        DEFAULT            : { $ref: '#/components/schemas/ActiveReeferSettings' },
    },
    actor: {
        PARENTS                : { EndorsementChainLink: {} },
        DEFAULT                : { $ref: '#/components/schemas/TransactionParty' },
    },
    additionalContainerCargoHandling: {
        PARENTS            : { DangerousGoods: {} },
        DEFAULT            : { type: 'string', maxLength: 255 },
    },
    address: {
        PARENTS            : {
            Location: {$ref: '#/components/schemas/Address'},
            LoadLocation: {$ref: '#/components/schemas/Address'},
            DischargeLocation: {$ref: '#/components/schemas/Address'},
            PlaceOfAcceptance: {$ref: '#/components/schemas/Address'},
            PlaceOfFinalDelivery: {$ref: '#/components/schemas/Address'},
            PlaceOfReceipt: {$ref: '#/components/schemas/Address'},
            PortOfLoading: {$ref: '#/components/schemas/Address'},
            PortOfDischarge: {$ref: '#/components/schemas/Address'},
            PlaceOfDelivery: {$ref: '#/components/schemas/Address'},
            OnwardInlandRouting: {$ref: '#/components/schemas/Address'},
            BookingAgent: {$ref: '#/components/schemas/PartyAddress'},
            Shipper: {$ref: '#/components/schemas/PartyAddress'},
            ShipperHBL: {$ref: '#/components/schemas/PartyAddress'},
            Consignee: {$ref: '#/components/schemas/PartyAddress'},
            ConsigneeHBL: {$ref: '#/components/schemas/PartyAddress'},
            Endorsee: {$ref: '#/components/schemas/PartyAddress'},
            ServiceContractOwner: {$ref: '#/components/schemas/PartyAddress'},
            CarrierBookingOffice: {$ref: '#/components/schemas/Address'},
            NotifyParty: { $ref: '#/components/schemas/PartyAddress'},
            NotifyPartyHBL: { $ref: '#/components/schemas/PartyAddress'},
            Seller: { $ref: '#/components/schemas/PartyAddress'},
            Buyer: { $ref: '#/components/schemas/PartyAddress'},
            Party: {$ref: '#/components/schemas/PartyAddress'},
            CarriersAgentAtDestination: {$ref: '#/components/schemas/Address'},
            IssuingParty: {$ref: '#/components/schemas/PartyAddress'},
            EmptyContainerDepotReleaseLocation: {$ref: '#/components/schemas/Address'},
            ContainerPositioningLocation: {$ref: '#/components/schemas/Address'},
            TransportCallLocation: { $ref: '#/components/schemas/Address' }
        },
    },
    Address: {
        'CS_v1.0.0'        : { DEFAULT: { type: 'object', title: 'Address', required: ['street', 'city', 'countryCode'], CHILDREN: ['street', 'streetNumber', 'floor', 'postCode', 'city', 'stateRegion', 'countryCode'] } },
        DEFAULT            : { type: 'object', title: 'Address', required: ['street', 'city', 'countryCode'], CHILDREN: ['street', 'streetNumber', 'floor', 'postCode', 'PObox', 'city', 'stateRegion', 'countryCode'] },
    },
//    AddressLocation: {
//        DEFAULT            : { type: 'object', title: 'Address Location', required: ['locationType', 'address'], CHILDREN: ['locationName', 'locationType', 'address'] },
//    },
    advanceManifestFilings: {
        PARENTS            : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT            : { type: 'array', items: {$ref: '#/components/schemas/AdvanceManifestFiling'} },
    },
    AdvanceManifestFiling: {
        'BKG_v2.0.0'       : { DEFAULT: { required: ['manifestTypeCode', 'countryCode'], CHILDREN: ['manifestTypeCode','countryCode'] } },
        'BKG_v2.0.0-Beta-2': { DEFAULT: { required: ['manifestTypeCode', 'countryCode'], CHILDREN: ['manifestTypeCode','countryCode'] } },
        'BKG_v2.0.0-Beta-3': { DEFAULT: { required: ['manifestTypeCode', 'countryCode'], CHILDREN: ['manifestTypeCode','countryCode'] } },
        DEFAULT            : { type: 'object', title: 'Advance Manifest Filing', required: ['manifestTypeCode', 'countryCode', 'advanceManifestFilingsHouseBLPerformedBy'], CHILDREN: ['manifestTypeCode','countryCode','advanceManifestFilingsHouseBLPerformedBy','selfFilerCode','supplementaryDeclarantEORINumber'] },
    },
    advanceManifestFilingsHouseBLPerformedBy: {
        PARENTS            : { AdvanceManifestFiling: {} },
        DEFAULT            : { type: 'string', enum: ['SELF', 'CARRIER'] },
    },
    airExchangeSetpoint: {
        PARENTS            : { ActiveReeferSettings: {} },
        DEFAULT            : { type: 'number', format: 'float', minimum: 0 },
    },
    airExchangeUnit: {
        PARENTS            : { ActiveReeferSettings: {} },
        DEFAULT            : { type: 'string', enum: ['MQH', 'FQH']},
    },
    amendedBooking: {
        DEFAULT                : { title: 'Amended Booking', basedOn: 'Booking' },
    },
    amendedBookingStatus: {
        'BKG_NTF_v2.0.0-Beta-2': { PARENTS : { data: {} } },
        'BKG_NTF_v2.0.0-Beta-3': { PARENTS : { data: {} } },
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, BookingRefCancelledStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    arrival: {
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfArrival' },
    },
    barge: {
        DEFAULT             : { $ref: '#/components/schemas/Barge' },
    },
    Barge: {
        DEFAULT                : { type: 'object', title: 'Barge', CHILDREN: ['vesselIMONumber','MMSINumber','name','flag','callSign','operatorCarrierCode','operatorCarrierCodeListProvider'] },
    },
    BargeTransport: {
        DEFAULT                : { type: 'object', title: 'Barge Transport', required: ['modeOfTransport'], CHILDREN: ['modeOfTransport','portVisitReference','transportCallReference','servicePartners','universalServiceReference','universalExportVoyageReference','universalImportVoyageReference','barge'] },
    },
    Booking: {
        DEFAULT                : { type: 'object', title: 'Booking', required: ['bookingStatus', 'receiptTypeAtOrigin', 'deliveryTypeAtDestination', 'cargoMovementTypeAtOrigin', 'cargoMovementTypeAtDestination', 'isPartialLoadAllowed', 'isExportDeclarationRequired', 'isImportLicenseRequired', 'communicationChannelCode', 'isEquipmentSubstitutionAllowed', 'shipmentLocations', 'requestedEquipments', 'documentParties'] },
    },
    booking: {
        DEFAULT                : { basedOn: 'Booking' },
    },
    bookingAgent: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/BookingAgent' },
    },
    BookingAgent: {
        DEFAULT                : { type: 'object', title: 'Booking Agent', required: ['partyName'], CHILDREN: ['partyName', 'address', 'partyContactDetails', 'identifyingCodes', 'taxLegalReferences','reference']},
    },
    bookingChannelReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', maxLength: 20, pattern: '^\\S(?:.*\\S)?$' },
    },
    BookingRefCancelledStatus: {
        DEFAULT                : { type: 'object', title: 'Cancelled Booking Response', required: ['bookingStatus'] },
    },
    BookingRefStatus: {
        DEFAULT                : { type: 'object', title: 'Booking Response', required: ['bookingStatus'] },
    },
    BookingNotification: {
        DEFAULT                : { type: 'object', title: 'Booking Notification', required: ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype', 'subscriptionReference', 'data'] },
    },
    bookingStatus: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    bookingCancellationStatus: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    buyer: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/Buyer' },
    },
    Buyer: {
        DEFAULT                : { type: 'object', title: 'Buyer', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','identifyingCodes','taxLegalReferences'] },
    },
    calculationBasis: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$'},
    },
    callSign: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { pattern: null }, PARENTS                 : null },
        PARENTS                : { Vessel: {}, Barge: {} },
        DEFAULT                : { type: 'string', maxLength: 10, pattern: '^\\S(?:.*\\S)?$' },
    },
    cargoGrossVolume: {
        PARENTS                : { CommodityShipper: {}, Commodity: {} },
        DEFAULT                : { type: 'object', title: 'Cargo Gross Volume', required: ['value','unit'], CHILDREN: ['value','unit'] },
    },
    cargoGrossWeight: {
        PARENTS                : { CommodityShipper: {}, Commodity: {} },
        DEFAULT                : { type: 'object', title: 'Cargo Gross Weight', required: ['value','unit'], CHILDREN: ['value','unit'] },
    },
    CargoItem: {
        DEFAULT                : { type: 'object', title: 'Cargo Item', required: ['equipmentReference', 'grossWeight', 'outerPackaging'], CHILDREN: ['equipmentReference','grossWeight','grossVolume','outerPackaging','nationalCommodityCodes','customsReferences'] },
    },
    cargoItems: {
        PARENTS                : {
            ConsignmentItemCarrier: { items: {$ref: '#/components/schemas/CargoItem' } },
            ConsignmentItemShipper: { items: {$ref: '#/components/schemas/CargoItemShipper' } },
            ConsignmentItem       : { items: {$ref: '#/components/schemas/CargoItem' } }
        },
        DEFAULT                : { type: 'array', minItems: 1 },
    },
    CargoItemShipper: {
        DEFAULT                : {type: 'object', title: 'Cargo Item (Shipper)', required: ['equipmentReference', 'grossWeight'], CHILDREN: ['equipmentReference','grossWeight','grossVolume','outerPackaging','nationalCommodityCodes','houseBillOfLadingReference','customsReferences'] },
    },
    cargoMovementTypeAtOrigin: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    cargoMovementTypeAtDestination: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    carrierBookingOffice: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/CarrierBookingOffice' },
    },
    CarrierBookingOffice: {
        DEFAULT                : { type: 'object', title: 'Carrier Booking Office', required: ['partyName', 'UNLocationCode'], CHILDREN: ['partyName','UNLocationCode','address','partyContactDetails'] },
    },
    carrierBookingRequestReference: {
        'BKG_NTF_v2.0.0-Beta-1': { DEFAULT: { pattern: '^\\S+(\\s+\\S+)*$'}, PARENTS : null }, //BKG NTF 2.0.0 Beta 1
        'BKG_NTF_v2.0.0-Beta-2': { PARENTS : { data: {} } },
        'BKG_NTF_v2.0.0-Beta-3': { PARENTS : { data: {} } },
        PARENTS                : { UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, BookingRefCancelledStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
    carrierBookingReference: {
        'BKG_NTF_v2.0.0-Beta-1': { DEFAULT: { pattern: '^\\S+(\\s+\\S+)*$' } }, //BKG NTF 2.0.0 Beta 1
        'BKG_NTF_v2.0.0-Beta-2': { PARENTS : { data: {} } },
        'BKG_NTF_v2.0.0-Beta-3': { PARENTS : { data: {} } },
        PARENTS                : { UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, BookingRefCancelledStatus: {}, ConsignmentItem: {}, ConsignmentItemShipper: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    carrierClauses: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', items: { type: 'string', maxLength: 20000, pattern: '^\\S(?:.*\\S)?$'} },
    },
    carrierCode: {
        PARENTS                : { booking: {}, amendedBooking: {}, CreateBooking: {}, UpdateBooking: {}, Booking: {}, TransportDocument: {}, transportDocument: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 4, pattern: '^\\S+$' },
    },
    carrierCodeListProvider: {
        PARENTS                : { booking: {}, amendedBooking: {}, CreateBooking: {}, UpdateBooking: {}, Booking: {}, TransportDocument: {}, transportDocument: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', enum: ['SMDG', 'NMFTA'] },
    },
    carrierExportVoyageNumber: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 50 } },
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, Transport: {}, VesselVoyage: {}, TransportCall: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$'},
    },
    carrierImportVoyageNumber: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', maxLength: 50 },
        PARENTS                : { Transport: {}, TransportCall: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$' },
    },
    carriersAgentAtDestination: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/CarriersAgentAtDestination' },
    },
    CarriersAgentAtDestination: {
        DEFAULT                : { type: 'object', title: 'Carrier\'s Agent At Destination', required: ['partyName', 'address', 'partyContactDetails'], CHILDREN: ['partyName','address','partyContactDetails'] },
    },
    carrierServiceCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { maxLength: 5 } },
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, Transport: {}, ServiceSchedule: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 11, pattern: '^\\S(?:.*\\S)?$' },
    },
    carrierServiceName: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, ServiceSchedule: {}, ServicePartner: {}, ServicePartnerSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$'},
    },
    carrierTransportCallReference: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', maxLength: 100 },
        PARENTS                : { timestamp: {} },
    },
    carrierVoyageNumber: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 50, deprecated: true } },
    },
    Charge: {
        DEFAULT                : { type: 'object', title: 'Charge', required: ['chargeName', 'currencyAmount', 'currencyCode', 'paymentTermCode', 'calculationBasis', 'unitPrice', 'quantity'], CHILDREN: ['chargeName','currencyAmount','currencyCode','paymentTermCode','calculationBasis','unitPrice','quantity'] },
    },
    chargeName: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$' },
    },
    charges: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/Charge'}},
    },
    city: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { pattern: null } },
        PARENTS                : { PortOfLoading: { type: null, maxLength: null, pattern: null, $ref: '#/components/schemas/City' }, PortOfDischarge: { type: null, maxLength: null, pattern: null, $ref: '#/components/schemas/City' }, address: {}, Address: {}, PartyAddress: {}, City: {} },
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    City: {
        DEFAULT                : { type: 'object', title: 'City', required: ['city', 'countryCode'], CHILDREN: ['city','stateRegion','countryCode'] },
    },
    co2Setpoint: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0, maximum: 100 },
    },
    code: {
        PARENTS                : { Feedback: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    codedVariantList: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', minLength: 4, maxLength: 4, pattern: '^[0-3][0-9A-Z]{3}$' },
    },
    codeListName: {
        PARENTS                : { IdentifyingCode: {}, identifyingCode: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    codeListProvider: {
        PARENTS                : { IdentifyingCode: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    codeListResponsibleAgencyCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', deprecated: true, enum: ['5','6','11','20','54','182','274','296','306','399','zzz'] }, PARENTS: { identifyingCode: {} } },
    },
    comments: {
        PARENTS                : { SurrenderRequestAnswer: {}, SurrenderRequestDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 255, pattern: '^\\S(?:.*\\S)?$'},
    },
    commodities: {
        PARENTS                : { RequestedEquipment: { items: { $ref: '#/components/schemas/Commodity' } }, RequestedEquipmentShipper: { items: { $ref: '#/components/schemas/CommodityShipper' } } },
        DEFAULT                : { type: 'array' },
    },
    CommodityShipper: {
        DEFAULT                : { type: 'object', title: 'Commodity (Shipper)', required: ['commodityType', 'cargoGrossWeight'], CHILDREN: ['commodityType','HSCodes','nationalCommodityCodes','cargoGrossWeight','cargoGrossVolume','exportLicenseIssueDate','exportLicenseExpiryDate','outerPackaging','references','customsReferences'] },
    },
    Commodity: {
        DEFAULT                : { type: 'object', title: 'Commodity', required: ['commodityType', 'cargoGrossWeight'], CHILDREN: ['commoditySubreference', 'commodityType','HSCodes','nationalCommodityCodes','cargoGrossWeight','cargoGrossVolume','exportLicenseIssueDate','exportLicenseExpiryDate','outerPackaging','references','customsReferences'] },
    },
    commoditySubreference: {
        PARENTS                : { Commodity: {}, ConsignmentItemShipper: {} },
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
    commodityType: {
        PARENTS                : { CommodityShipper: {}, Commodity: {} },
        DEFAULT                : { type: 'string', maxLength: 550, pattern: '^\\S(?:.*\\S)?$' },
    },
    communicationChannelCode: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', maxLength: 2 },
    },
    competentAuthorityApproval: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 70, pattern:'^\\S(?:.*\\S)?$' },
    },
    confirmedEquipments: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/ConfirmedEquipment' } },
    },
    ConfirmedEquipment: {
        DEFAULT                : { type: 'object', title: 'Confirmed Equipment', required: ['ISOEquipmentCode', 'units'], CHILDREN: ['ISOEquipmentCode','units','containerPositionings','emptyContainerPickup'] },
    },
    consignee: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/Consignee' },
    },
    Consignee: {
        'BKG_v2.0.0'           :   { DEFAULT: { CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences','reference','purchaseOrderReference'] } },
        'BKG_v2.0.0-Beta-3'    :   { DEFAULT: { CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences'] } },
        DEFAULT                : { type: 'object', title: 'Consignee', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','displayedAddress','identifyingCodes','taxLegalReferences','partyContactDetails','reference','purchaseOrderReference'] },
    },
    ConsigneeHBL: {
        DEFAULT                : { type: 'object', title: 'Consignee', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','identifyingCodes','taxLegalReferences','partyContactDetails'] },
    },
    consignmentItems: {
        PARENTS                : {CreateShippingInstructions: { items: { $ref: '#/components/schemas/ConsignmentItemShipper' } }, UpdateShippingInstructions: { items: { $ref: '#/components/schemas/ConsignmentItemShipper' } }, ShippingInstructions: { items: { $ref: '#/components/schemas/ConsignmentItemShipper' } }, shippingInstructions: { items: { $ref: '#/components/schemas/ConsignmentItemShipper' } }, updatedShippingInstructions: { items: { $ref: '#/components/schemas/ConsignmentItemShipper' } }, TransportDocument: { items: { $ref: '#/components/schemas/ConsignmentItem' } }, transportDocument: { items: { $ref: '#/components/schemas/ConsignmentItem' } } },
        DEFAULT                : { type: 'array', minItems: 1 },
    },
//  ConsignmentItem: {
//    DEFAULT                : { type: 'object', title: 'Consignment Item', required: ['carrierBookingReference', 'descriptionOfGoods', 'HSCodes'], CHILDREN: ['carrierBookingReference','descriptionOfGoods','HSCodes','shippingMarks','references','customsReferences'] },
//  },
    ConsignmentItem: {
        DEFAULT                : { type: 'object', title: 'Consignment Item', required: ['carrierBookingReference', 'descriptionOfGoods', 'HSCodes','cargoItems'], CHILDREN: ['carrierBookingReference','descriptionOfGoods','HSCodes','nationalCommodityCodes','shippingMarks','cargoItems', 'references','customsReferences'] },
    },
    ConsignmentItemShipper: {
        DEFAULT                : { type: 'object', title: 'Consignment Item (Shipper)', required: ['carrierBookingReference', 'descriptionOfGoods', 'HSCodes','cargoItems'], CHILDREN: ['carrierBookingReference','commoditySubreference', 'descriptionOfGoods','HSCodes','nationalCommodityCodes','shippingMarks','cargoItems','references','customsReferences'], allOf: true },
    },
    contact: {
        PARENTS                : { EmergencyContactDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 255 },
    },
    ContainerPositioning: {
        DEFAULT                : { type: 'object', title: 'Container Positioning', required: ['location'], CHILDREN: ['dateTime', 'location' ] },
    },
    ContainerPositioningEstimated: {
        DEFAULT                : { type: 'object', title: 'Container Positioning Estimated', required: ['location'], CHILDREN: ['estimatedDateTime', 'location' ] },
    },
    containerPositionings : {
        PARENTS                : { RequestedEquipment: {}, RequestedEquipmentShipper: {}, ConfirmedEquipment: { items: { $ref: '#/components/schemas/ContainerPositioningEstimated' } }},
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/ContainerPositioning' } },
    },
    ContainerPositioningLocation: {
        DEFAULT                : { type: 'object', title: 'Container Positioning Location', CHILDREN: ['locationName', 'address', 'facility','UNLocationCode','geoCoordinate' ] },
    },
    content: {
        PARENTS                : { SupportingDocument: {} },
        DEFAULT                : { type: 'string', format: 'byte' },
    },
    contentType: {
        PARENTS                : { SupportingDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 100, default: 'application/pdf' },
    },
    contractQuotationReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    country: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 75}, PARENTS: { address: {} } },
    },
    countryCode: {
        PARENTS                : { placeOfBLIssue: {}, placeOfIssue: {}, address: {}, City: {}, Address: {}, PartyAddress: {}, AdvanceManifestFiling: {}, TaxLegalReference: {}, CustomsReference: {}, NationalCommodityCode: {} },
        DEFAULT                : { type: 'string', maxLength: 2, minLength: 2, pattern: '^[A-Z]{2}$' },
    },
    CreateBooking: {
        DEFAULT                : { type: 'object', title: 'Create Booking', required: ['receiptTypeAtOrigin', 'deliveryTypeAtDestination', 'cargoMovementTypeAtOrigin', 'cargoMovementTypeAtDestination', 'isPartialLoadAllowed', 'isExportDeclarationRequired', 'isImportLicenseRequired', 'communicationChannelCode', 'isEquipmentSubstitutionAllowed', 'shipmentLocations', 'requestedEquipments', 'documentParties'] },
    },
    CreateShippingInstructions: {
        DEFAULT                : { type: 'object', title: 'Create Shipping Instructions', required: ['transportDocumentTypeCode', 'isShippedOnBoardType', 'isElectronic', 'isToOrder', 'freightPaymentTermCode', 'partyContactDetails', 'documentParties', 'consignmentItems', 'utilizedTransportEquipments'] },
    },
    currencyAmount: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0 },
    },
    currencyCode: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'string', pattern: '^[A-Z]{3}$', minLength: 3, maxLength: 3 },
    },
    CustomsReference: {
        DEFAULT                : { type: 'object', title: 'Customs Reference', required: ['type', 'countryCode', 'values'], CHILDREN: ['type','countryCode','values'] },
    },
    customsReferences: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, ConsignmentItem: {}, ConsignmentItemShipper: {}, CargoItemCarrier: {}, CargoItemShipper: {}, UtilizedTransportEquipmentCarrier: {}, UtilizedTransportEquipmentShipper: {}, TransportDocument: {}, transportDocument: {}, UtilizedTransportEquipment: {}, CargoItem: {}, RequestedEquipment: {}, RequestedEquipmentShipper: {}, Commodity: {}, CommodityShipper: {} },
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/CustomsReference' } },
    },
    cutOffDateTime: {
        PARENTS                : { ShipmentCutOffTime: {}, CutOffTime: {} },
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    cutOffDateTimeCode: {
        PARENTS                : { ShipmentCutOffTime: {}, CutOffTime: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    CutOffTime: {
        DEFAULT                : { type: 'object', title: 'Cut-Off Time', required: ['cutOffDateTimeCode', 'cutOffDateTime'], CHILDREN: ['cutOffDateTimeCode','cutOffDateTime'] },
    },
    cutOffTimes: {
        PARENTS                : { PointToPoint: {}, Schedule: {}, TransportCall: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/CutOffTime'} },
    },
    dangerousGoods: {
        PARENTS                : { OuterPackaging: {}, OuterPackagingCarrier: {} },
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/DangerousGoods' } },
    },
    DangerousGoods: {
        'BKG_v2.0.0'           : { DEFAULT: { required: ['properShippingName', 'imoClass', 'isMarinePollutant', 'isLimitedQuantity', 'isExceptedQuantity', 'isSalvagePackings', 'isEmptyUncleanedResidue', 'isWaste', 'isHot', 'isCompetentAuthorityApprovalRequired', 'isReportableQuantity', 'emergencyContactDetails', 'grossWeight'], CHILDREN: ['codedVariantList','properShippingName','technicalName','imoClass','subsidiaryRisk1','subsidiaryRisk2','isMarinePollutant','packingGroup','isLimitedQuantity','isExceptedQuantity','isSalvagePackings','isEmptyUncleanedResidue','isWaste','isHot','isCompetentAuthorityApprovalRequired','competentAuthorityApproval','segregationGroups','innerPackagings','emergencyContactDetails','EMSNumber','endOfHoldingTime','fumigationDateTime','isReportableQuantity','inhalationZone','grossWeight','netWeight','netExplosiveContent','netVolume','limits','specialCertificateNumber','additionalContainerCargoHandling'] } },
        DEFAULT                : { type: 'object', title: 'Dangerous Goods', oneOf: true, required: ['properShippingName', 'imoClass'], CHILDREN: ['codedVariantList','properShippingName','technicalName','imoClass','subsidiaryRisk1','subsidiaryRisk2','isMarinePollutant','packingGroup','isLimitedQuantity','isExceptedQuantity','isSalvagePackings','isEmptyUncleanedResidue','isWaste','isHot','isCompetentAuthorityApprovalRequired','competentAuthorityApproval','segregationGroups','innerPackagings','emergencyContactDetails','EMSNumber','endOfHoldingTime','fumigationDateTime','isReportableQuantity','inhalationZone','grossWeight','netWeight','netExplosiveContent','netVolume','limits'] },
    },
    data: {
        PARENTS                : { BookingNotification: { required: ['bookingStatus'], CHILDREN: ['bookingStatus', 'amendedBookingStatus', 'bookingCancellationStatus', 'carrierBookingRequestReference', 'carrierBookingReference', 'feedbacks', 'booking', 'amendedBooking'] }, ShippingInstructionsNotification: { required: ['shippingInstructionsStatus'], CHILDREN: ['shippingInstructionsStatus', 'updatedShippingInstructionsStatus', 'shippingInstructionsReference', 'transportDocumentReference', 'feedbacks', 'shippingInstructions', 'updatedShippingInstructions'] }, TransportDocumentNotification: { required: ['transportDocumentStatus', 'transportDocumentReference'], CHILDREN: ['transportDocumentStatus', 'shippingInstructionsReference', 'transportDocumentReference', 'feedbacks', 'transportDocument'] } },
        DEFAULT                : { type: 'object', title: 'Data' },
    },
    datacontenttype: {
        PARENTS                : DCSA_CLOUDEVENT_GROUP,
        DEFAULT                : { type: 'string', enum: ['application/json'] },
    },
    dateTime: {
        PARENTS                : { PlaceOfReceipt: {}, ContainerPositioning: {}, emptyContainerPickup: {}, PlaceOfDelivery: {}, PlaceOfArrival: {}, PlaceOfDeparture: {} },
        DEFAULT                : { type: 'string', format: 'date-time'}
    },
    estimatedDateTime: {
        PARENTS                : { ContainerPositioningEstimated: {} },
        DEFAULT                : { type: 'string', format: 'date-time'}
    },
    DCSAResponsibleAgencyCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['ISO', 'UNECE', 'LLOYD', 'BIC', 'IMO', 'SCAC', 'ITIGG', 'ITU', 'SMDG', 'EXIS', 'FMC', 'CBSA', 'ZZZ'] }, PARENTS: { identifyingCode: {} } },
    },
    declaredValue: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0 },
    },
    declaredValueCurrency: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', minLength: 3, maxLength: 3, pattern: '^[A-Z]{3}$' },
    },
    delayReasonCode: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', maxLength: 3 }
    },
    deliveryTypeAtDestination: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {}, PointToPoint: {} },
        DEFAULT                : { type: 'string', maxLength: 3, enum: ['CY', 'SD', 'CFS'] },
    },
    departure: {
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfDeparture' },
    },
    depotReleaseLocation: {
        DEFAULT                : { $ref: '#/components/schemas/EmptyContainerDepotReleaseLocation' },
    },
    description: {
        PARENTS                : { OuterPackaging: {}, InnerPackaging: {}, OuterPackagingShipper: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    descriptionOfGoods: {
        PARENTS                : { ConsignmentItem: {}, ConsignmentItemShipper: {} },
        DEFAULT                : { type: 'array', maxItems: 150, items: { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' } },
    },
    destinationChargesPaymentTerm: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {} },
        DEFAULT                : { $ref: '#/components/schemas/DestinationChargesPaymentTerm' },
    },
    DestinationChargesPaymentTerm: {
        DEFAULT                : { type: 'object', title: 'Destination Charges Payment Term', CHILDREN: ['haulageChargesPaymentTermCode','portChargesPaymentTermCode','otherChargesPaymentTermCode'] },
    },
    DetailedError: {
        DEFAULT                : { type: 'object', title: 'Detailed Error', required: ['errorCodeText', 'errorCodeMessage'], CHILDREN: ['errorCode','property','value','jsonPath','errorCodeText','errorCodeMessage'] },
    },
    dimensionUnit: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['MTR', 'FOT'] }, PARENTS: { vessel: {} } },
    },
    dischargeLocation: {
        PARENTS                : {Transport: {$ref:'#/components/schemas/DischargeLocation' } },
    },
    DischargeLocation: {
        DEFAULT                : { type: 'object', title: 'Discharge Location', CHILDREN: ['locationName', 'address', 'facility', 'UNLocationCode'] },
    },
    displayedAddress: {
        PARENTS                : { Shipper: {}, Consignee: {}, Endorsee: {}, NotifyParty: {} },
        DEFAULT                : { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 35 } },
    },
    displayedNameForPlaceOfDelivery: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', maxItems: 5, items: { type: 'string', maxLength: 35 } },
    },
    displayedNameForPlaceOfReceipt: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', maxItems: 5, items: { type: 'string', maxLength: 35 } },
    },
    displayedNameForPortOfDischarge: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', maxItems: 5, items: { type: 'string', maxLength: 35 } },
    },
    displayedNameForPortOfLoad: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'array', maxItems: 5, items: { type: 'string', maxLength: 35 } },
    },
    displayedShippedOnBoardReceivedForShipment: {
        DEFAULT                : { type: 'string', pattern: '^\\S(?:.*\\S)?$', maxLength: 250 },
    },
    document: {
        PARENTS                : { IssuanceRequest: {} },
        DEFAULT                : { $ref: '#/components/schemas/TransportDocument' },
    },
    documentChecksum: {
        DEFAULT                : { type: 'string', pattern: '^[0-9a-f]+$', maxLength: 64, minLength: 64 },
    },
    DocumentChecksum: {
        DEFAULT                : { type: 'string', pattern: '^[0-9a-f]+$', maxLength: 64, minLength: 64 },
    },
    documentParties: {
        'BKG_v2.0.0'           : { DEFAULT: { required: ['bookingAgent'], CHILDREN: ['bookingAgent','shipper','consignee','serviceContractOwner','carrierBookingOffice','other'] }, PARENTS: {Booking: { required: null }, booking: { required: null }, amendedBooking: { required: null }, CreateBooking: {}, UpdateBooking: {} } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { required: ['bookingAgent'], CHILDREN: ['bookingAgent','shipper','consignee','serviceContractOwner','carrierBookingOffice','other'] }, PARENTS: {Booking: { required: null }, CreateBooking: {}, UpdateBooking: {} } },
        'BKG_v2.0.0-Beta-3'    : { DEFAULT: { required: ['bookingAgent'], CHILDREN: ['bookingAgent','shipper','consignee','serviceContractOwner','carrierBookingOffice','other'] }, PARENTS: {Booking: { required: null }, CreateBooking: {}, UpdateBooking: {} } },
        PARENTS                : { CreateShippingInstructions: { required: ['shipper'], CHILDREN: ['shipper','consignee','endorsee','issueTo','seller','buyer','notifyParties','other'] }, UpdateShippingInstructions: { required: ['shipper'], CHILDREN: ['shipper','consignee','endorsee','issueTo','seller','buyer','notifyParties','other'] }, ShippingInstructions: { required: ['shipper'], CHILDREN: ['shipper','consignee','endorsee','issueTo','seller','buyer','notifyParties','other'] }, shippingInstructions: { required: ['shipper'], CHILDREN: ['shipper','consignee','endorsee','issueTo','seller','buyer','notifyParties','other'] }, updatedShippingInstructions: { required: ['shipper'], CHILDREN: ['shipper','consignee','endorsee','issueTo','seller','buyer','notifyParties','other'] }, CreateBooking: { required: ['bookingAgent'] }, UpdateBooking: { required: ['bookingAgent'] }, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: { required: ['shipper','issuingParty'] }, transportDocument: { required: ['shipper','issuingParty'] }, HouseBillOfLading: { CHILDREN: ['shipper','consignee','notifyParty','seller','buyer','other'] } },
        DEFAULT                : { type: 'object', title: 'Document Parties', CHILDREN: ['shipper','consignee','endorsee','issuingParty','carriersAgentAtDestination','notifyParties','other'] },
    },
    draft: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'number', format: 'float'}, PARENTS: { vessel: {} } },
    },
    duplicateOfAcceptedEnvelopeTransferChainEntrySignedContent: {
        DEFAULT                : { type: 'string', pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$' },
    },
    EblEnvelope: {
        DEFAULT                : { type: 'object', title: 'Ebl Envelope', required: ['transportDocument', 'envelopeManifestSignedContent','envelopeTransferChain'], CHILDREN: ['transportDocument', 'envelopeManifestSignedContent','envelopeTransferChain'] },
    },
    eblPlatform: {
        DEFAULT                : { type: 'string', maxLength: 4, pattern: '^\\S+$' },
    },
    eBLVisualisationByCarrier: {
        PARENTS                : { IssuanceRequest: {}, EnvelopeManifest: {} },
        DEFAULT                : { $ref: '#/components/schemas/SupportingDocument' },
    },
    eBLVisualisationByCarrierChecksum: {
        DEFAULT                : { type: 'string', pattern: '^[0-9a-f]+$', maxLength: 64, minLength: 64 },
    },
    email: {
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^.+@\\S+$' },
    },
    EmergencyContactDetails: {
        DEFAULT                : { type: 'object', title: 'Emergency Contact Details', required: ['contact', 'phone'], CHILDREN: ['contact','provider','phone','referenceNumber'] },
    },
    emergencyContactDetails: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { $ref: '#/components/schemas/EmergencyContactDetails' },
    },
    emptyContainerPickup: {
        DEFAULT                : { type: 'object', title: 'Empty Container Pickup', CHILDREN: ['dateTime','depotReleaseLocation'] },
    },
    emptyContainerPickupDateTime: {
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    emptyContainerDepotReleaseLocation: {
        DEFAULT                : { $ref: '#/components/schemas/EmptyContainerDepotReleaseLocation' },
    },
    EmptyContainerDepotReleaseLocation: {
        DEFAULT                : { type: 'object', title: 'Empty Container Depot Release Location', CHILDREN: ['locationName', 'address', 'facility','UNLocationCode','geoCoordinate' ] },
    },
    EMSNumber: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 7 },
    },
    endOfHoldingTime: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    endorsee: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/Endorsee' },
    },
    Endorsee: {
        DEFAULT                : { type: 'object', title: 'Endorsee', required: ['partyName'], CHILDREN: ['partyName','address','displayedAddress','identifyingCodes','taxLegalReferences','partyContactDetails'] },
    },
    endorsementChain: {
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/EndorsementChainLink' } },
    },
    EndorsementChainLink: {
        DEFAULT                : { type: 'object', title: 'Endorsement Chain Link', required: ['actionDateTime', 'actionCode', 'actor', 'recipient'] },
    },
    EnvelopeManifest: {
        DEFAULT                : { type: 'object', title: 'Envelope Manifest', required: ['transportDocumentChecksum','lastEnvelopeTransferChainEntrySignedContentChecksum','supportingDocuments'], CHILDREN: ['transportDocumentChecksum','lastEnvelopeTransferChainEntrySignedContentChecksum','eBLVisualisationByCarrier','supportingDocuments'] },
    },
    envelopeManifestSignedContent: {
        DEFAULT                : { $ref: '#/components/schemas/EnvelopeManifestSignedContent' },
    },
    EnvelopeManifestSignedContent: {
        DEFAULT                : { type: 'string', pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$' },
    },
    envelopeReference: {
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    envelopeTransferChain: {
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/EnvelopeTransferChainEntrySignedContent' } },
    },
    EnvelopeTransferChainEntry: {
        DEFAULT                : { type: 'object', title: 'Envelope Transfer Chain Entry', required: ['eblPlatform','transportDocumentChecksum','transactions'], CHILDREN: ['eblPlatform','transportDocumentChecksum','previousEnvelopeTransferChainEntrySignedContentChecksum','issuanceManifestSignedContent','transactions'] },
    },
    EnvelopeTransferChainEntrySignedContent: {
        DEFAULT                : { type: 'string', pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$' },
    },
    EnvelopeTransferFinishedResponse: {
        DEFAULT                : { type: 'object', title: 'Envelope Transfer Finished Response', required: ['lastEnvelopeTransferChainEntrySignedContentChecksum','responseCode'], CHILDREN: ['lastEnvelopeTransferChainEntrySignedContentChecksum','responseCode', 'duplicateOfAcceptedEnvelopeTransferChainEntrySignedContent', 'reason', 'missingAdditionalDocumentChecksums', 'receivedAdditionalDocumentChecksums'] },
    },
    EnvelopeTransferFinishedResponseSignedContent: {
        DEFAULT                : { type: 'string', pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$' },
    },
    EnvelopeTransferStartedResponse: {
        DEFAULT                : { type: 'object', title: 'Envelope Transfer Started Response', required: ['envelopeReference','transportDocumentChecksum','lastEnvelopeTransferChainEntrySignedContentChecksum','missingAdditionalDocumentChecksums'], CHILDREN: ['envelopeReference','transportDocumentChecksum','lastEnvelopeTransferChainEntrySignedContentChecksum','missingAdditionalDocumentChecksums'] },
    },
    equipment: {
        PARENTS                : { UtilizedTransportEquipmentCarrier: { $ref: '#/components/schemas/Equipment' }, UTEquipment: { $ref: '#/components/schemas/RequiredEquipment' }, UtilizedTransportEquipment: { $ref: '#/components/schemas/Equipment' } },
    },
    Equipment: {
        DEFAULT                : { type: 'object', title: 'Equipment', required: ['equipmentReference'], CHILDREN: ['equipmentReference','ISOEquipmentCode','tareWeight'] },
    },
    equipmentReference: {
        PARENTS                : { CargoItemCarrier: {}, CargoItemShipper: {}, UTEquipmentReference: {}, Equipment: {}, RequiredEquipment: {}, CargoItem: {} },
        DEFAULT                : { type: 'string', maxLength: 11, pattern: '^\\S(?:.*\\S)?$' },
    },
    equipmentReferences: {
        PARENTS                : { RequestedEquipment: {}, RequestedEquipmentShipper: {}, CargoItemCarrier: {} },
        DEFAULT                : { type: 'array', items: { type: 'string', maxLength: 11, pattern: '^\\S(?:.*\\S)?$' } },
    },
    errorDateTime: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', format: 'date-time' } },
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    errorCode: {
        PARENTS                : { DetailedError: {}, errors: {}, IssuanceError: {type: 'string', maxLength: 50, pattern: '^\\S+$', format: null, minimum: null, maximum: null } },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 7000, maximum: 9999 },
    },
    errorCodeMessage: {
        PARENTS                : { DetailedError: {}, errors: {} },
        DEFAULT                : { type: 'string', maxLength: 5000 },
    },
    errorCodeText: {
        PARENTS                : { DetailedError: {}, errors: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    ErrorResponse: {
        DEFAULT                : { type: 'object', title: 'Error Response', required: ['httpMethod', 'requestUri', 'statusCode', 'statusCodeText', 'errorDateTime', 'errors'], CHILDREN: ['httpMethod','requestUri','statusCode','statusCodeText','statusCodeMessage','providerCorrelationReference','errorDateTime','errors'] },
    },
    errors: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { minItems: null, items: null } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { items: null }, PARENTS: { ErrorResponse: {} } },
        PARENTS                : { ErrorResponse: {}, IssuanceResponse: {minItems: null, maxItems: 255, items: {$ref: '#/components/schemas/IssuanceError'}} },
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/DetailedError'} },
    },
    estimatedEmptyContainerPickupDateTime: {
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    eventCreatedDateTime: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', format: 'date-time' }
    },
    eventDateTime: {
        'jit_v1.2.0-Beta-2'    : { },
        PARENTS                : { Timestamp: {} },
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    eventID: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', format: 'uuid' } }
    },
    eventLocation: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'object', title: 'Event Location' } },
    },
    eventType: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['OPERATIONS'] } },
    },
    eventTypeCode: {
        PARENTS                : {  Timestamp: {} },
        DEFAULT                : { type: 'string', enum: ['ARRI', 'DEPA'] },
    },
    eventClassifierCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['PLN', 'ACT', 'REQ', 'EST'] } },
        PARENTS                : { Timestamp: {} },
        DEFAULT                : { type: 'string', enum: ['PLN', 'EST', 'ACT'] },
    },
    expectedArrivalAtPlaceOfDeliveryStartDate: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    expectedArrivalAtPlaceOfDeliveryEndDate: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    expectedDepartureDate: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    exportDeclarationReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    exportLicenseExpiryDate: {
        PARENTS                : { CommodityShipper: {}, Commodity: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    exportLicenseIssueDate: {
        PARENTS                : { CommodityShipper: {}, Commodity: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    exportVoyageNumber: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 50, deprecated: true } },
    },
    Facility: {
        DEFAULT                : { type: 'object', title: 'Facility', required: ['facilityCode', 'facilityCodeListProvider'], CHILDREN: ['facilityCode','facilityCodeListProvider'] },
    },
    facility: {
        DEFAULT                : { $ref: '#/components/schemas/Facility' },
    },
    facilityCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { pattern: null }, PARENTS: { TransportCall: {}, location: {nullable: false}, eventLocation: {nullable: false} } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { nullable: false, pattern: '^\\S(?:.*\\S)?$' },PARENTS: { Facility: {} } },
        PARENTS                : { Facility: {} },
        DEFAULT                : { type: 'string', maxLength: 6, pattern: '^\\S(?:.*\\S)?$' },
    },
    facilitySMDGCode: {
        'jit_v1.2.0-Beta-2'    : { PARENTS: { timestamp: { nullable: false, deprecated: true } } },
        PARENTS                : { FacilitySMDGLocation: {}, TransportCallLocation: {}, PortScheduleLocation: {} },
        DEFAULT                : { type: 'string', maxLength: 6 },
    },
    FacilitySMDGLocation: {
        DEFAULT                : { type: 'object', title: 'Facility SMDG Location', required: ['locationType', 'UNLocationCode', 'facilitySMDGCode'], CHILDREN: [] },
    },
    facilityTypeCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { maxLength: null }, PARENTS: { timestamp: { enum: ['PBPL', 'BRTH'] }, TransportCall: { enum: ['BOCR', 'CLOC', 'COFS', 'COYA', 'OFFD', 'DEPO', 'INTE', 'POTE', 'RAMP'] } } },
        DEFAULT                : { type: 'string', maxLength: 4},
    },
    facilityCodeListProvider: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['BIC', 'SMDG'] } },
        PARENTS                : { Facility: {} },
        DEFAULT                : { type: 'string', enum: ['BIC', 'SMDG'] },
    },
    Feedback: {
        DEFAULT                : { type: 'object', title: 'Feedback', required: ['severity', 'code', 'message'], CHILDREN: ['severity', 'code', 'message', 'jsonPath', 'property'] },
    },
    feedbacks: {
        PARENTS                : { ShippingInstructions: {}, shippingInstructions: {}, updatedShippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingRefStatus: {}, data: {} },
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/Feedback' } },
    },
    flag: {
        PARENTS                : { Vessel: {}, Barge: {} },
        DEFAULT                : { type: 'string', maxLength: 2, minLength: 2, pattern: '^[A-Z]{2}$' },
    },
    flashPoint: {
        PARENTS                : { Limits: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    floor: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { pattern: null }, PARENTS: { Address: {}, address: {} } },
        PARENTS                : { Address: {}, address: {}, PartyAddress: {} },
        DEFAULT                : { type: 'string', pattern: '^\\S(?:.*\\S)?$', maxLength: 50 },
    },
    freeText: {
        PARENTS                : { invoicePayableAt: {} },
        DEFAULT                : { type: 'string', maxLength: 35 }, // In TD invoicePayableAt
    },
    freightPaymentTermCode: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {},  CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', enum: ['PRE', 'COL'] },
    },
    fumigationDateTime: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', format: 'date-time' },
    },
    GeoCoordinate: {
        DEFAULT                : { type: 'object', title: 'Geo Coordinate', required: ['latitude', 'longitude'], CHILDREN: ['latitude', 'longitude'] },
    },
    geoCoordinate: {
        DEFAULT                : { $ref: '#/components/schemas/GeoCoordinate' },
    },
    grossVolume: {
        DEFAULT                : { type: 'object', title: 'Gross Volume', required: ['value', 'unit'], CHILDREN: ['value','unit'] },
    },
    grossWeight: {
        DEFAULT                : { type: 'object', title: 'Gross Weight', required: ['value', 'unit'], CHILDREN: ['value','unit'] },
    },
    haulageChargesPaymentTermCode: {
        PARENTS                : { OriginChargesPaymentTerm: {}, DestinationChargesPaymentTerm: {} },
        DEFAULT                : { type: 'string', enum: ['PRE', 'COL'] },
    },
    HouseBillOfLading: {
        DEFAULT                : { type: 'object', title: 'House Bill of Lading', required: ['houseBillOfLadingReference'], CHILDREN: ['houseBillOfLadingReference','isToOrder','placeOfAcceptance','placeOfFinalDelivery','methodOfPayment','documentParties'] },
    },
    houseBillOfLadingReference: {
        DEFAULT                : { type: 'string', maxLength: 20, pattern: '^\\S(?:.*\\S)?$' },
    },
    houseBillOfLadings: {
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/HouseBillOfLading'} },
    },
    HSCodes: {
        PARENTS                : { CommodityShipper: {}, Commodity: {}, ConsignmentItem: { minItems: 1 }, ConsignmentItemShipper: {minItems: 1} },
        DEFAULT                : { type: 'array', items: { type: 'string', minLength: 6, maxLength: 10, pattern: '^\\d{6,10}$' } },
    },
    httpMethod: {
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string', enum: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTION', 'PATCH'] },
    },
    humiditySetpoint: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0, maximum: 100 },
    },
    id: {
        PARENTS                : DCSA_CLOUDEVENT_GROUP,
        DEFAULT                : { type: 'string', maxLength: 100},
    },
    IdentifyingCode: {
        DEFAULT                : { type: 'object', title: 'Identifying Code', required: ['codeListProvider', 'partyCode'], CHILDREN: ['codeListProvider','partyCode','codeListName'] },
    },
    identifyingCodes: {
        'jit_v1.2.0-Beta-2'    : { PARENTS: { publisher: {} } },
        PARENTS                : { BookingAgent: {}, Shipper: {}, ShipperHBL: {}, Consignee: {}, ConsigneeHBL: {}, Endorsee: {}, ServiceContractOwner: {}, CarrierBookingOffice: {}, Party: {}, IssuingParty: {}, IssueToParty: {}, TransactionParty: {}, SurrenderRequestedBy: {}, NotifyParty: {}, NotifyPartyHBL: {}, Seller: {}, Buyer: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/IdentifyingCode'} },
    },
    imoClass: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 4 },
    },
    imoPackagingCode: {
        PARENTS                : { OuterPackaging: {}, OuterPackagingCarrier: {} },
        DEFAULT                : { type: 'string', minLength: 1, maxLength: 5, pattern: '^[A-Z0-9]{1,5}$' },
    },
    importLicenseReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    importVoyageNumber: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', maxLength: 50, deprecated: true },
    },
    incoTerms: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    inhalationZone: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', minLength: 1, maxLength: 1 },
    },
    InnerPackaging: {
        DEFAULT                : { type: 'object', title: 'Inner Packaging', required: ['quantity', 'material', 'description'], CHILDREN: ['quantity','material','description'] },
    },
    innerPackagings: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/InnerPackaging' } },
    },
    InvoicePayableAt: {
        DEFAULT                : { type: 'object', title: 'Invoice Payable At', required: ['UNLocationCode'], CHILDREN: [] },
    },
    invoicePayableAt: {
        'BKG_v2.0.0-Beta-1'    : { DEFAULT: { required: ['XXX'] } },
        PARENTS                : { CreateBooking: { required: ['UNLocationCode'] }, UpdateBooking: { required: ['UNLocationCode'] }, Booking: { required: ['UNLocationCode'] }, booking: { required: ['UNLocationCode'] }, amendedBooking: { required: ['UNLocationCode'] }, CreateShippingInstructions: { required: ['UNLocationCode'] }, UpdateShippingInstructions: { required: ['UNLocationCode'] }, ShippingInstructions: { required: ['UNLocationCode'] }, shippingInstructions: { required: ['UNLocationCode'] }, updatedShippingInstructions: { required: ['UNLocationCode'] }, TransportDocument: { oneOf: true }, transportDocument: { oneOf: true } },
        DEFAULT                : { type: 'object', title: 'Invoice Payable At', CHILDREN: ['UNLocationCode'] },
    },
    isBulbMode: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isCarriersAgentAtDestinationRequired: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isColdTreatmentRequired: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isCompetentAuthorityApprovalRequired: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isControlledAtmosphereRequired: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isDrainholesOpen: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isDummyVessel: {
        PARENTS                : { Schedule: {}, VesselVoyage: {}, VesselSchedule: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isElectronic: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isEmptyUncleanedResidue: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isEquipmentSubstitutionAllowed: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isExceptedQuantity: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isExportDeclarationRequired: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isGeneratorSetRequired: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isHBLIssued: {
        DEFAULT                : { type: 'boolean' },
    },
    isHot: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isImportLicenseRequired: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isLimitedQuantity: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isMarinePollutant: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isNonOperatingReefer: {
        PARENTS                : { RequestedEquipment: {}, RequestedEquipmentShipper: {}, UtilizedTransportEquipmentCarrier: {}, UtilizedTransportEquipment: {} },
        DEFAULT                : { type: 'boolean' },
    },
    ISOEquipmentCode: {
        PARENTS                : { ConfirmedEquipment: {}, RequestedEquipment: {}, RequestedEquipmentShipper: {}, Equipment: {}, RequiredEquipment: {} },
        DEFAULT                : { type: 'string', maxLength: 4, pattern: '^\\S(?:.*\\S)?$' },
    },
    isPartialLoadAllowed: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isPreCoolingRequired: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isReportableQuantity: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isSalvagePackings: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isShippedOnBoardType: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isShipperOwned: {
        PARENTS                : { RequestedEquipment: {}, RequestedEquipmentShipper: {}, UtilizedTransportEquipmentCarrier: {}, UTEquipment: {}, UTEquipmentReference: {}, UtilizedTransportEquipment: {} },
        DEFAULT                : { type: 'boolean' },
    },
    IssuanceError: {
        DEFAULT                : { type: 'object', title: 'Issuance Error', CHILDREN: ['reason', 'errorCode'] },
    },
    IssuanceManifest: {
        DEFAULT                : { type: 'object', title: 'Issuance Manifest', required: ['documentChecksum', 'issueToChecksum'], CHILDREN: ['documentChecksum', 'eBLVisualisationByCarrierChecksum', 'issueToChecksum'] },
    },
    issuanceManifestSignedContent: {
        DEFAULT                : { type: 'string', pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$' },
    },
    IssuanceRequest: {
        DEFAULT                : { type: 'object', title: 'Issuance Request', required: ['document', 'issueTo', 'issuanceManifestSignedContent'] },
    },
    IssuanceResponse: {
        DEFAULT                : { type: 'object', title: 'Issuance Response', required: ['transportDocumentReference', 'issuanceResponseCode'], CHILDREN: ['transportDocumentReference', 'issuanceResponseCode', 'reason', 'errors'] },
    },
    issuanceResponseCode: {
        DEFAULT                : { type: 'string', enum: ['ISSU','BREQ', 'REFU'] },
    },
    issueDate: {
        PARENTS                : { TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    issueTo: {
        PARENTS                : { IssuanceRequest: {}, documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/IssueToParty' },
    },
    issueToChecksum: {
        DEFAULT                : { type: 'string', pattern: '^[0-9a-f]+$', maxLength: 64, minLength: 64 },
    },

    IssueToParty: {
        DEFAULT                : { type: 'object', title: 'Issue To Party', required: ['partyName', 'sendToPlatform'], CHILDREN: ['partyName', 'sendToPlatform', 'identifyingCodes', 'taxLegalReferences'] },
    },
    issuingParty: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/IssuingParty'  },
    },
    IssuingParty: {
        DEFAULT                : { type: 'object', title: 'Issuing Party', required: ['partyName', 'address'], CHILDREN: ['partyName','address','identifyingCodes','taxLegalReferences','partyContactDetails'] },
    },
    isToOrder: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {}, HouseBillOfLading: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isVentilationOpen: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'boolean' },
    },
    isWaste: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'boolean' },
    },
    jsonPath: {
        PARENTS                : { Feedback: {}, DetailedError: {} },
        DEFAULT                : { type: 'string', maxLength: 500 },
    },
    lastEnvelopeTransferChainEntrySignedContentChecksum: {
        DEFAULT                : { type: 'string', minLength: 64, maxLength: 64, pattern: '^[0-9a-f]+$' },
    },
    latitude: {
        'jit_v1.2.0-Beta-2'    : { type: 'string', maxLength: 10 },
        PARENTS                : { GeoCoordinate: {} },
        DEFAULT                : { type: 'string', maxLength: 10 },
    },
    Leg: {
        DEFAULT                : { type: 'object', title: 'Leg', required: ['departure', 'arrival'], CHILDREN: ['sequenceNumber', 'transport', 'departure', 'arrival'] },
    },
    legs: {
        PARENTS                : { PointToPoint: {} },
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/Leg'} },
    },
    lengthOverall: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'number', format: 'float' } },
    },
    Limits: {
        DEFAULT                : { type: 'object', title: 'Limits', required: ['temperatureUnit'], CHILDREN: ['temperatureUnit','flashPoint','transportControlTemperature','transportEmergencyTemperature','SADT','SAPT'] },
    },
    limits: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { $ref: '#/components/schemas/Limits' },
    },
    loadLocation: {
        PARENTS                : { Transport: {$ref:'#/components/schemas/LoadLocation' } },
    },
    LoadLocation: {
        DEFAULT                : { type: 'object', title: 'Load Location', CHILDREN: ['locationName', 'address', 'facility', 'UNLocationCode' ] },
    },
    location: {
        'CS_v1.0.0'            : { PARENTS: { PlaceOfReceipt: { $ref: '#/components/schemas/Location' }, TransportCall: { $ref: '#/components/schemas/TransportCallLocation' }, PortSchedule: { $ref: '#/components/schemas/PortScheduleLocation' }, PlaceOfDelivery: { $ref: '#/components/schemas/Location' }, PlaceOfArrival: { $ref: '#/components/schemas/Location' }, PlaceOfDeparture: { $ref: '#/components/schemas/Location' } } },
        'jit_v1.2.0-Beta-2'    : { PARENTS: { TransportCall: {} } },
        PARENTS                : { ShipmentLocation: {}, ContainerPositioning: {$ref: '#/components/schemas/ContainerPositioningLocation'}, ContainerPositioningEstimated: {$ref: '#/components/schemas/ContainerPositioningLocation'} },
        DEFAULT                : { $ref: '#/components/schemas/Location' },
    },
    Location: {
        'CS_v1.0.0'            : { DEFAULT: { type: 'object', title: 'Location', CHILDREN: ['locationName','address','UNLocationCode','facility'] } },
        DEFAULT                : { type: 'object', title: 'Location', CHILDREN: ['locationName','address','facility','UNLocationCode','geoCoordinate'] },
    },
    locationName: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { pattern: null },PARENTS: { location: {}, eventLocation: {} } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { pattern: null },PARENTS: { AddressLocation: {}, Facility: { pattern: '^\\S(?:.*\\S)?$' }, UNLocationLocation: { pattern: '^\\S(?:.*\\S)?$' }, placeOfBLIssue: {}, placeOfIssue: {} } },
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
//    locationType: {
//        PARENTS                : { AddressLocation: {}, CityLocation: {}, Facility: {}, UNLocationLocation: {}, FacilitySMDGLocation: {} },
//        DEFAULT                : { type: 'string', maxLength: 4 },
//    },
    locationTypeCode: {
        PARENTS                : { ShipmentLocation: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    longitude: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 11 } },
        PARENTS                : { GeoCoordinate: {} },
        DEFAULT                : { type: 'string', maxLength: 11 },
    },
    manifestTypeCode: {
        PARENTS                : { AdvanceManifestFiling: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$' },
    },
    material: {
        PARENTS                : { InnerPackaging: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    message: {
        'jit_v1.2.0-Beta-2'    : { PARENTS: { subError: {} } },
        PARENTS                : { Feedback: {} },
        DEFAULT                : { type: 'string', maxLength: 5000 },
    },
    methodOfPayment: {
        DEFAULT                : { type: 'string', maxLength: 1 },
    },
    milesToDestinationPort: {
        'jit_v1.2.0-Beta-2'    : { type: 'number', format: 'float' }
    },
    missingAdditionalDocumentChecksums: {
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/DocumentChecksum' } },
    },
    MMSINumber: {
        DEFAULT                : { type: 'string', minLength: 9, maxLength: 9, pattern: '^\\d{9}$' },
    },
    modeOfTransport: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { enum: ['VESSEL', 'RAIL', 'TRUCK', 'BARGE'] }, PARENTS: { timestamp: { deprecated: true }, TransportCall: {} } },
        '???'                :   { DEFAULT: { enum: ['VESSEL', 'RAIL', 'TRUCK', 'BARGE'] } },
        PARENTS                : { Transport: {}, VesselTransport: { maxLength: null, enum: ['VESSEL']}, BargeTransport: { maxLength: null, enum: ['BARGE']}, OtherTransport: { maxLength: null, enum: ['RAIL_TRUCK', 'BARGE_TRUCK', 'BARGE_RAIL', 'MULTIMODAL', 'RAIL', 'TRUCK'] } },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    name: {
        PARENTS                : { Vessel: { maxLength: 50 }, Barge: { maxLength: 50 }, SupportingDocument: {maxLength: 100, pattern: null }, vessel: { maxLength: 50 }, PartyContactDetail: { maxLength: 35 } },
        DEFAULT                : { type: 'string', pattern: '^\\S(?:.*\\S)?$' },
    },
    naNumber: {
        DEFAULT                : { type: 'string', minLength: 4, maxLength: 4, pattern: '^\\d{4}$' },
    },
    NationalCommodityCode: {
        DEFAULT                : { type: 'object', title: 'National Commodity Code', required: ['type', 'countryCode', 'values'], CHILDREN: ['type', 'countryCode', 'values'] },
    },
    nationalCommodityCodes: {
        PARENTS                : { Commodity: {}, CommodityShipper: {}, ConsignmentItem: {}, ConsignmentItemShipper: {}, CargoItem: {}, CargoItemShipper: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/NationalCommodityCode'} },
    },
    netExplosiveContent: {
        DEFAULT                : { type: 'object', title: 'Net Explosive Content', required: ['value', 'unit'], CHILDREN: ['value','unit'] },
    },
    netWeight: {
        DEFAULT                : { type: 'object', title: 'Net Weight', required: ['value', 'unit'], CHILDREN: ['value','unit'] },
    },
    netVolume: {
        PARENTS                : { DangerousGoods: {type: 'object', title: 'Net Volume', required: ['value', 'unit']} },
    },
    nmftaCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 4, deprecated: true }, PARENTS: { publisher: {} } },
    },
    notifyParties: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { type: 'array', maxItems: 3, items: {$ref: '#/components/schemas/NotifyParty'} },
    },
    notifyParty: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/NotifyPartyHBL' },
    },
    NotifyParty: {
        DEFAULT                : { type: 'object', title: 'Notify Party', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','displayedAddress','identifyingCodes','taxLegalReferences','partyContactDetails', 'reference'] },
    },
    NotifyPartyHBL: {
        DEFAULT                : { type: 'object', title: 'Notify Party', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','identifyingCodes','taxLegalReferences','partyContactDetails'] },
    },
    number: {
        PARENTS                : { Seal: {} },
        DEFAULT                : { type: 'string', maxLength: 15 },
    },
    numberOfCopiesWithCharges: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 0 },
    },
    numberOfCopiesWithoutCharges: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 0 },
    },
    numberOfOriginalsWithCharges: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 0 },
    },
    numberOfOriginalsWithoutCharges: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 0 },
    },
    numberOfPackages: {
        PARENTS                : { OuterPackaging: {}, OuterPackagingShipper: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 1 },
    },
    numberOfRiderPages: {
        PARENTS                : { TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 0 },
    },
    o2Setpoint: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0, maximum: 100 },
    },
    onCarriageBy: {
        PARENTS                : { Transports: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    onwardInlandRouting: {
        PARENTS                : { Transports: {} },
        DEFAULT                : { $ref: '#/components/schemas/OnwardInlandRouting' },
    },
    OnwardInlandRouting: {
        DEFAULT                : { type: 'object', title: 'Onward Inland Routing', CHILDREN: ['locationName','address','facility','UNLocationCode'] },
    },
    operationsEventTypeCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['STRT', 'CMPL', 'ARRI', 'DEPA'] } },
    },
    operatorCarrierCode: {
        PARENTS                : { Vessel: {}, Barge: {} },
        DEFAULT                : { type: 'string', maxLength: 10 },
    },
    operatorCarrierCodeListProvider: {
        PARENTS                : { Vessel: {}, Barge: {} },
        DEFAULT                : { type: 'string', enum: ['SMDG', 'NMFTA'] },
    },
    originChargesPaymentTerm: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {} },
        DEFAULT                : { $ref: '#/components/schemas/OriginChargesPaymentTerm' },
    },
    OriginChargesPaymentTerm: {
        DEFAULT                : { type: 'object', title: 'Origin Charges Payment Term', CHILDREN: ['haulageChargesPaymentTermCode','portChargesPaymentTermCode','otherChargesPaymentTermCode'] },
    },
    OuterPackaging: {
        'BKG_v2.0.0'           : { DEFAULT: { required: null, CHILDREN: ['packageCode','imoPackagingCode','numberOfPackages','description','dangerousGoods'] } },
        'BKG_v2.0.0-Beta-3'    : { DEFAULT: { required: null } },
        DEFAULT                : { type: 'object', title: 'Outer Packaging', required: ['numberOfPackages', 'description'], CHILDREN: ['packageCode','imoPackagingCode','numberOfPackages','description','woodDeclaration','dangerousGoods'] },
    },
    outerPackaging: {
        PARENTS                : { CommodityShipper: {$ref: '#/components/schemas/OuterPackaging'}, Commodity: {$ref: '#/components/schemas/OuterPackaging'}, CargoItemCarrier: {$ref: '#/components/schemas/OuterPackaging'}, CargoItemShipper: {$ref: '#/components/schemas/OuterPackagingShipper'}, CargoItem: {$ref: '#/components/schemas/OuterPackaging'} },
    },
//  OuterPackagingCarrier: {
//    DEFAULT                : { type: 'object', title: 'Outer Packaging (Carrier)', allOf: true, CHILDREN: ['imoPackagingCode','dangerousGoods'] },
//  },
    OuterPackagingShipper: {
        DEFAULT                : { type: 'object', title: 'Outer Packaging (Shipper)', required: ['numberOfPackages', 'description'], CHILDREN: ['packageCode','numberOfPackages','description','woodDeclaration'] },
    },
    other: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/OtherDocumentParty'} },
    },
    otherChargesPaymentTermCode: {
        PARENTS                : { OriginChargesPaymentTerm: {}, DestinationChargesPaymentTerm: {} },
        DEFAULT                : { type: 'string', enum: ['PRE', 'COL'] },
    },
    OtherDocumentParty: {
        DEFAULT                : { type: 'object', title: 'Other Document Party', required: ['party', 'partyFunction'], CHILDREN: ['party','partyFunction'] },
    },
    OtherDocumentPartyHBL: {
        DEFAULT                : { type: 'object', title: 'Other Document Party', required: ['party', 'partyFunction'], CHILDREN: ['party','partyFunction'] },
    },
    otherFacility: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 50 } },
    },
    OtherTransport: {
        DEFAULT                : { type: 'object', title: 'Other Transport', additionalProperties: false, required: ['modeOfTransport'], CHILDREN: ['modeOfTransport'] },
    },
    packageCode: {
        PARENTS                : { OuterPackaging: {}, OuterPackagingShipper: {} },
        DEFAULT                : { type: 'string', minLength: 2, maxLength: 2, pattern: '^[A-Z0-9]{2}$' },
    },
    packingGroup: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 1, maximum: 3 },
    },
    party: {
        PARENTS                : { OtherDocumentParty: {}, OtherDocumentPartyHBL: {} },
        DEFAULT                : { $ref: '#/components/schemas/Party' },
    },
    Party: {
        DEFAULT                : { type: 'object', title: 'Party', required: ['partyName'], CHILDREN: ['partyName','address','identifyingCodes','taxLegalReferences','partyContactDetails', 'reference'] },
    },
    PartyAddress: {
        DEFAULT                : { type: 'object', title: 'Party Address', required: ['street', 'city', 'countryCode'], CHILDREN: ['street','streetNumber','floor','postCode','PObox', 'city','UNLocationCode','stateRegion','countryCode'] },
    },
    partyCode: {
        PARENTS                : { IdentifyingCode: {}, identifyingCode: {} },
        DEFAULT                : { type: 'string', maxLength: 150 },
    },
    partyContactDetails: {
        'BKG_v2.0.0'           : { DEFAULT: {items: {$ref: '#/components/schemas/PartyContactDetail'} },PARENTS: { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingAgent: {minItems: 1}, Shipper: {minItems: 1}, Consignee: {minItems: 1}, ServiceContractOwner: {minItems: 1}, CarrierBookingOffice: {minItems: 1}, Party: {minItems: 1} } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: {items: {$ref: '#/components/schemas/PartyContactDetail'} }, PARENTS: { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingAgent: {minItems: 1}, Shipper: {minItems: 1}, Consignee: {minItems: 1}, ServiceContractOwner: {minItems: 1}, CarrierBookingOffice: {minItems: 1}, Party: {minItems: 1} } },
        'BKG_v2.0.0-Beta-3'    : { DEFAULT: {items: {$ref: '#/components/schemas/PartyContactDetail'} },PARENTS: { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, BookingAgent: {minItems: 1}, Shipper: {minItems: 1}, Consignee: {minItems: 1}, ServiceContractOwner: {minItems: 1}, CarrierBookingOffice: {minItems: 1}, Party: {minItems: 1} } },
        PARENTS                : { CreateShippingInstructions: {minItems: 1}, UpdateShippingInstructions: {minItems: 1}, ShippingInstructions: {minItems: 1}, shippingInstructions: {minItems: 1}, updatedShippingInstructions: {minItems: 1}, Shipper: {}, ShipperHBL: {}, Consignee: {}, ConsigneeHBL: {}, Endorsee: {}, NotifyParty: {}, NotifyPartyHBL: {}, Party: {}, CarriersAgentAtDestination: {}, IssuingParty: {}, TransportDocument: {minItems: 1}, transportDocument: { minItems: 1 } },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/PartyContactDetail'} },
    },
    PartyContactDetail: {
        DEFAULT                : { type: 'object', title: 'Party Contact Detail', required: ['name'], CHILDREN: ['name'] },
    },
    partyFunction: {
        PARENTS                : { OtherDocumentParty: {}, OtherDocumentPartyHBL: {} },
        DEFAULT                : { type: 'string', maxLength: 3 },
    },
    partyName: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 100 } },
        PARENTS                : { BookingAgent: {}, Shipper: {}, ShipperHBL: {}, Consignee: {}, ConsigneeHBL: {}, Endorsee: {}, ServiceContractOwner: {}, CarrierBookingOffice: {}, Party: {}, CarriersAgentAtDestination: {}, IssuingParty: {}, IssueToParty: {}, TransactionParty: {}, SurrenderRequestedBy: {}, NotifyParty: {}, NotifyPartyHBL: {}, Seller: {}, Buyer: {}, ReceiverValidationResponse: {} },
        DEFAULT                : { type: 'string', maxLength: 70, pattern: '^\\S(?:.*\\S)?$' },
    },
    paymentTermCode: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'string', enum: ['PRE', 'COL'] },
    },
    phone: {
        PARENTS                : { PartyContactDetail: {}, EmergencyContactDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 30, pattern: '^\\S(?:.*\\S)?$' },
    },
    placeOfAcceptance: {
        PARENTS                : { HouseBillOfLading: {} },
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfAcceptance' },
    },
    PlaceOfAcceptance: {
        DEFAULT                : { type: 'object', title: 'Place of Acceptance', CHILDREN: ['locationName','address','facility','UNLocationCode','geoCoordinate'] },
    },
    PlaceOfArrival: {
        DEFAULT                : { type: 'object', title: 'Place of Arrival', required: ['facilityTypeCode','location','dateTime'], CHILDREN: ['facilityTypeCode','location','dateTime'] },
    },
    placeOfBLIssue: {
        'BKG_v2.0.0-Beta-1'    : { DEFAULT: { type: 'object', title: 'Place of B/L Issue' } },//<-- Needs to be modified
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'object', title: 'Place of B/L Issue', oneOf: {UNLocationCode: {}, countryCode: {} }, CHILDREN: ['locationName'] },
    },
    PlaceOfDeparture: {
        DEFAULT                : { type: 'object', title: 'Place of Departure', required: ['facilityTypeCode','location','dateTime'], CHILDREN: ['facilityTypeCode','location','dateTime'] },
    },
    placeOfFinalDelivery: {
        PARENTS                : { HouseBillOfLading: {} },
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfFinalDelivery' },
    },
    PlaceOfFinalDelivery: {
        DEFAULT                : { type: 'object', title: 'Place of Final Delivery', CHILDREN: ['locationName','address','facility','UNLocationCode','geoCoordinate'] },
    },
    placeOfIssue: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'object', title: 'Place of Issue', oneOf: true, CHILDREN: ['locationName'] },
    },
    placeOfDelivery: {
        PARENTS                : { Transports: {}, PointToPoint: {} },
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfDelivery' },
    },
    PlaceOfDelivery: {
        'CS_v1.0.0'            : { DEFAULT: { required: ['facilityTypeCode','location','dateTime'], CHILDREN: ['facilityTypeCode','location','dateTime'] } },
        DEFAULT                : { type: 'object', title: 'Place of Delivery', CHILDREN: ['locationName','address','facility','UNLocationCode','geoCoordinate'] },
    },
    placeOfReceipt: {
        PARENTS                : { Transports: {}, PointToPoint: {} },
        DEFAULT                : { $ref: '#/components/schemas/PlaceOfReceipt' },
    },
    PlaceOfReceipt: {
        'CS_v1.0.0'            : { DEFAULT: { required: ['facilityTypeCode','location','dateTime'], CHILDREN: ['facilityTypeCode','location','dateTime'] } },
        DEFAULT                : { type: 'object', title: 'Place of Receipt', CHILDREN: ['locationName','address','facility','UNLocationCode','geoCoordinate'] },
    },
    plannedArrivalDate: {
        PARENTS                : { Transport: {}, Transports: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    plannedDepartureDate: {
        PARENTS                : { Transport: {}, Transports: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    PObox: {
        DEFAULT                : { type: 'string', maxLength: 20 },
    },
    PointToPoint: {
        DEFAULT                : { type: 'object', title: 'Point to Point', required: ['placeOfReceipt', 'placeOfDelivery', 'legs'], CHILDREN: ['placeOfReceipt','placeOfDelivery','receiptTypeAtOrigin','deliveryTypeAtDestination','cutOffTimes','solutionNumber','transitTime','legs'] },
    },
    portCallPhaseTypeCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['INBD', 'ALGS', 'SHIF', 'OUTB'] } },
    },
    portCallServiceTypeCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['PILO', 'MOOR', 'CRGO', 'TOWG', 'BUNK', 'WSDP', 'LASH', 'SAFE', 'FAST', 'GWAY'] } },
    },
    portChargesPaymentTermCode: {
        PARENTS                : { OriginChargesPaymentTerm: {}, DestinationChargesPaymentTerm: {} },
        DEFAULT                : { type: 'string', enum: ['PRE', 'COL'] },
    },
    portOfDischarge: {
        PARENTS                : { Transports: {} },
        DEFAULT                : { $ref: '#/components/schemas/PortOfDischarge' },
    },
    PortOfDischarge: {
        DEFAULT                : { type: 'object', title: 'Port of Discharge', CHILDREN: ['locationName','city','UNLocationCode'] },
    },
    portOfLoading: {
        PARENTS                : { Transports: {} },
        DEFAULT                : { $ref: '#/components/schemas/PortOfLoading' },
    },
    PortOfLoading: {
        DEFAULT                : { type: 'object', title: 'Port of Loading', CHILDREN: ['locationName','city','UNLocationCode'] },
    },
    PortSchedule: {
        DEFAULT                : { type: 'object', title: 'Port Schedule', required: ['location'], CHILDREN: ['location', 'vesselSchedules'] },
    },
    PortScheduleLocation: {
        DEFAULT                : { type: 'object', title: 'Port Schedule Location', CHILDREN: ['locationName','UNLocationCode','facilitySMDGCode'] },
    },
    portVisitReference: {
        PARENTS                : {  TransportCall: {}, VesselTransport: {}, BargeTransport: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    postCode: {
        PARENTS                : { Address: {}, address: {}, PartyAddress: {} },
        DEFAULT                : { type: 'string', maxLength: 10 },
    },
    preCarriageBy: {
        PARENTS                : { Transports: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    previousEnvelopeTransferChainEntrySignedContentChecksum: {
        DEFAULT                : { type: 'string', minLength: 64, maxLength: 64, pattern: '^[0-9a-f]+$', nullable: true },
    },
    property: {
        PARENTS                : { ErrorResponse: {}, Feedback: {}, DetailedError: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    provider: {
        PARENTS                : { EmergencyContactDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 255 },
    },
    properShippingName: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 250 },
    },
    providerCorrelationReference: {
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    publicKey: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 500 } },
    },
    publisher: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { $ref: true } },
    },
    publisherRole: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['CA', 'AG', 'VSL', 'ATH', 'PLT', 'TR', 'TWG', 'LSH', 'BUK'] } },
    },
    purchaseOrderReference: {
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    quantity: {
        PARENTS                : { InnerPackaging: { type: 'integer', format: 'int32' }, Charge: { type: 'number', format: 'float', minimum: 0 } },
    },
    reason: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { maxLength: null }, PARENTS: { subError: {} } },
        PARENTS                : { EnvelopeTransferFinishedResponse: {nullable: true, maxLength: 255}, IssuanceError: {maxLength: 255, pattern: '^\\S(?:.*\\S)?$'}, ShippingInstructions: {}, shippingInstructions: {}, updatedShippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, Booking: {}, booking: {}, amendedBooking: {}, data: {}, BookingRefStatus: {}, BookingRefCancelledStatus: {}, IssuanceResponse: {maxLength: 255, pattern: '^\\S(?:.*\\S)?$' } },
        DEFAULT                : { type: 'string', maxLength: 5000 },
    },
    reasonCode: {
        DEFAULT                : { type: 'string', maxLength: 4 },
    },
    remark: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 500 } },
    },
    receiptTypeAtOrigin: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {}, PointToPoint: {} },
        DEFAULT                : { type: 'string', maxLength: 3, enum: ['CY', 'SD', 'CFS'] },
    },
    receivedAdditionalDocumentChecksums: {
        DEFAULT                : { type: 'array', items: { $ref: '#/components/schemas/DocumentChecksum' } },
    },
    receivedForShipmentDate: {
        PARENTS                : { TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    ReceiverValidationResponse: {
        DEFAULT                : { type: 'object', title: 'Receiver Validation Response', required: ['partyName'], CHILDREN: ['partyName'] },
    },
    recipient: {
        PARENTS                : { EndorsementChainLink: {} },
        DEFAULT                : { $ref: '#/components/schemas/TransactionParty' },
    },
    reference: {
        DEFAULT                : { type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' },
    },
    Reference: {
        DEFAULT                : { type: 'object', title: 'Reference', required: ['type', 'value'], CHILDREN: ['type','value'] },
    },
    referenceNumber: {
        PARENTS                : { EmergencyContactDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 255 },
    },
    references: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, CreateBooking: { items: {$ref: '#/components/schemas/ReferenceShipper'} }, UpdateBooking: { items: {$ref: '#/components/schemas/ReferenceShipper'} }, Booking: {}, booking: {}, amendedBooking: {}, RequestedEquipment: {}, RequestedEquipmentShipper: { items: {$ref: '#/components/schemas/ReferenceShipper'} }, CommodityShipper: { items: {$ref: '#/components/schemas/ReferenceShipper'} }, Commodity: {}, ConsignmentItem: {}, ConsignmentItemShipper: {}, UtilizedTransportEquipmentCarrier: {}, UtilizedTransportEquipmentShipper: {}, TransportDocument: {}, transportDocument: {}, UtilizedTransportEquipment: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/Reference'} },
    },
    ReferenceShipper: {
        DEFAULT                : { type: 'object', title: 'Reference (Shipper)', required: ['type', 'value'], CHILDREN: ['type','value'] },
    },
    replyToTimestampID: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', format: 'uuid' } },
    },
    RequestedCarrierCertificate: {
        DEFAULT                : { type: 'string', maxLength: 100, title: 'Requested Carrier Certificate' },
    },
    RequestedCarrierClause: {
        DEFAULT                : { type: 'string', maxLength: 100, title: 'Requested Carrier Clause' },
    },
    requestedCarrierCertificates: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {} },
        DEFAULT                : { type: 'array', items: { type: 'string', maxLength: 100 } },
    },
    requestedCarrierClauses: {
        PARENTS                : { CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {} },
        DEFAULT                : { type: 'array', items: { type: 'string', maxLength: 100 } },
    },
    RequestedEquipment: {
        DEFAULT                : { type: 'object', title: 'Requested Equipment', required: ['ISOEquipmentCode', 'units','isShipperOwned'], oneOf: true, CHILDREN: ['ISOEquipmentCode','units','containerPositionings','emptyContainerPickup','equipmentReferences','tareWeight','isShipperOwned','isNonOperatingReefer','activeReeferSettings','references','customsReferences', 'commodities'] },
    },
    // RequestedEquipmentCarrier: {
    //   DEFAULT                : { type: 'object', title: 'Requested Equipment (Carrier)', allOf: true, CHILDREN: ['commodities'] },
    // },
    RequestedEquipmentShipper: {
        DEFAULT                : { type: 'object', title: 'Requested Equipment (Shipper)', required: ['ISOEquipmentCode', 'units','isShipperOwned'], oneOf: true, CHILDREN: ['ISOEquipmentCode','units','containerPositionings','emptyContainerPickup','equipmentReferences','tareWeight','isShipperOwned','isNonOperatingReefer','activeReeferSettings','references','customsReferences','commodities'] },
    },
    requestedEquipments: {
        PARENTS                : { CreateBooking: {items: {$ref: '#/components/schemas/RequestedEquipmentShipper'}}, UpdateBooking: {items: {$ref: '#/components/schemas/RequestedEquipmentShipper'}}, Booking: {items: {$ref: '#/components/schemas/RequestedEquipment'}}, booking: {items: {$ref: '#/components/schemas/RequestedEquipment'}}, amendedBooking: {items: {$ref: '#/components/schemas/RequestedEquipment'}} },
        DEFAULT                : { type: 'array', minItems: 1 },
    },
    requestUri: {
        'jit_v1.2.0-Beta-2'    : { },
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string' },
    },
    RequiredEquipment: {
        DEFAULT                : { type: 'object', title: 'Equipment (Required Properties)', required: ['equipmentReference', 'ISOEquipmentCode', 'tareWeight'], CHILDREN: ['equipmentReference','ISOEquipmentCode','tareWeight'] },
    },
    responseCode: {
        DEFAULT                : { type: 'string', enum: ['RECE','DUPE','BSIG','BENV','MDOC','DISE'] },
    },
    routingOfConsignmentCountries: {
        DEFAULT                : { type: 'array', items: { type: 'string', maxLength: 2, minLength: 2, pattern: '^[A-Z]{2}$' } },
    },
    SADT: {
        PARENTS                : { Limits: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    SAPT: {
        PARENTS                : { Limits: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    Schedule: {
        DEFAULT                : { type: 'object', title: 'Schedule', required: ['servicePartners', 'isDummyVessel', 'timestamps'] },
    },
    Seal: {
        DEFAULT                : { type: 'object', title: 'Seal', required: ['number'], CHILDREN: ['number','source'] },
    },
    seals: {
        PARENTS                : { UtilizedTransportEquipmentCarrier: {}, UtilizedTransportEquipmentShipper: {}, UtilizedTransportEquipment: {} },
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/Seal'} },
    },
    segregationGroups: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'array', items: {type: 'string', maxLength: 2} },
    },
    selfFilerCode: {
        PARENTS                : { AdvanceManifestFiling: {} },
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
    seller: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/Seller' },
    },
    Seller: {
        DEFAULT                : { type: 'object', title: 'Seller', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','identifyingCodes','taxLegalReferences'] },
    },
    sendToPlatform: {
        PARENTS                : { IssueToParty: {} },
        DEFAULT                : { type: 'string', maxLength: 4, pattern: '^\\S+$' },
    },
    sequenceNumber: {
        DEFAULT                : { type: 'integer', format: 'int32' },
    },
    serviceContractOwner: {
        PARENTS                : { documentParties: {} },
        DEFAULT                : { $ref: '#/components/schemas/ServiceContractOwner' },
    },
    ServiceContractOwner: {
        DEFAULT                : { type: 'object', title: 'Service Contract Owner', required: ['partyName'], CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences', 'reference'] },
    },
    serviceContractReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 30 },
    },
    ServicePartner: {
        DEFAULT                : { type: 'object', title: 'Service Partner', CHILDREN: ['carrierCode','carrierCodeListProvider', 'carrierServiceName','carrierServiceCode','carrierImportVoyageNumber','carrierExportVoyageNumber'] },
    },
    ServicePartnerSchedule: {
        DEFAULT                : { type: 'object', title: 'Service Partner Schedule', required: ['carrierServiceName','carrierServiceCode','carrierImportVoyageNumber','carrierExportVoyageNumber'], CHILDREN: ['carrierCode','carrierCodeListProvider','carrierServiceName','carrierServiceCode','carrierImportVoyageNumber','carrierExportVoyageNumber'] },
    },
    servicePartners: {
        PARENTS                : { Schedule: {}, VesselTransport: {minItems: null, items: {$ref: '#/components/schemas/ServicePartner' } }, BargeTransport: {minItems: null, items: {$ref: '#/components/schemas/ServicePartner' } } },
        DEFAULT                : { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/ServicePartnerSchedule' } },
    },
    ServiceSchedule: {
        DEFAULT                : { type: 'object', title: 'Service Schedule', required: ['carrierServiceName', 'carrierServiceCode', 'vesselSchedules'], CHILDREN: ['carrierServiceName','carrierServiceCode','universalServiceReference','vesselSchedules'] },
    },
    severity: {
        PARENTS                : { Feedback: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    shipmentCutOffTimes: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/ShipmentCutOffTime'} },
    },
    ShipmentCutOffTime: {
        DEFAULT                : { type: 'object', title: 'Shipment Cut-Off Time', required: ['cutOffDateTimeCode', 'cutOffDateTime'], CHILDREN: ['cutOffDateTimeCode','cutOffDateTime'] },
    },
    ShipmentLocation: {
        DEFAULT                : { type: 'object', title: 'Shipment Location', required: ['location', 'locationTypeCode'], CHILDREN: ['location','locationTypeCode'] },
    },
    shipmentLocations: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/ShipmentLocation'} },
    },
    shippedOnBoardDate: {
        PARENTS                : { TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', format: 'date' },
    },
    shipper: {
        PARENTS                : { documentParties: { } },
        DEFAULT                : { $ref: '#/components/schemas/Shipper' },
    },
    Shipper: {
        'BKG_v2.0.0'           : { DEFAULT: { CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences', 'reference', 'purchaseOrderReference'] } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences'] } },
        'BKG_v2.0.0-Beta-3'    : { DEFAULT: { CHILDREN: ['partyName','address','partyContactDetails','identifyingCodes','taxLegalReferences'] } },
        DEFAULT                : { type: 'object', title: 'Shipper', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','displayedAddress','identifyingCodes','taxLegalReferences','partyContactDetails', 'reference', 'purchaseOrderReference'] },
    },
    ShipperHBL: {
        DEFAULT                : { type: 'object', title: 'Shipper', required: ['partyName'], CHILDREN: ['partyName','typeOfPerson','address','identifyingCodes','taxLegalReferences','partyContactDetails'] },
    },
    ShippingInstructions: {
        DEFAULT                : { type: 'object', title: 'Shipping Instructions', required: ['shippingInstructionsStatus', 'transportDocumentTypeCode', 'isShippedOnBoardType', 'isElectronic', 'isToOrder', 'freightPaymentTermCode', 'partyContactDetails', 'documentParties', 'consignmentItems', 'utilizedTransportEquipments'] },
    },
    shippingInstructions: {
        DEFAULT                : { basedOn: 'ShippingInstructions' },
    },
    ShippingInstructionsNotification: {
        'ebl_ntf_v3.0.0-Beta-1': { DEFAULT: { required: ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype', 'data'] } },
        DEFAULT                : { type: 'object', title: 'Shipping Instructions Notification', required: ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype', 'subscriptionReference', 'data']},
    },
    shippingInstructionsReference: {
        'ebl_ntf_v3.0.0-Beta-1': { DEFAULT: { pattern: "^\\S+(\\s+\\S+)*$" }, PARENTS: { data: {} } }, //BKG NTF 2.0.0 Beta 1
        'EBL_NTF_v3.0.0-Beta-2': { PARENTS: { data: {} } },
        'EBL_NTF_v3.0.0-Beta-3': { PARENTS: { data: {} } },
        PARENTS                : { UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, TransportDocument: {}, transportDocument: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
    ShippingInstructionsRefCancelStatus: {
        DEFAULT                : { type: 'object', title: 'Shipping Instructions Cancel Response', required: ['shippingInstructionsStatus'] },
    },
    ShippingInstructionsRefStatus: {
        DEFAULT                : { type: 'object', title: 'Shipping Instructions Response', required: ['shippingInstructionsStatus'] },
    },
    shippingInstructionsStatus: {
        'ebl_ntf_v3.0.0-Beta-1'     : { PARENTS: { data: {} } },
        'EBL_NTF_v3.0.0-Beta-2'     : { PARENTS: { data: {} } },
        'EBL_NTF_v3.0.0-Beta-3'     : { PARENTS: { data: {} } },
        PARENTS                : { ShippingInstructions: {}, shippingInstructions: {}, updatedShippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    shippingMarks: {
        PARENTS                : { ConsignmentItem: {}, ConsignmentItemShipper: {}, UtilizedTransportEquipment: {}, UtilizedTransportEquipmentShipper: {} },
        DEFAULT                : { type: 'array', maxItems: 50, items: {type: 'string', maxLength: 35 } },
    },
    solutionNumber: {
        PARENTS                : { PointToPoint: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 1 }
    },
    source: {
        // Removing DCSA_CLOUDEVENT_GROUP in the default in order to handle 'source' inside a 'Seal'
        PARENTS                : { ShippingInstructionsNotification: {maxLength: 4096}, TransportDocumentNotification: {maxLength: 4096}, BookingNotification: {maxLength: 4096}, ArrivalNoticeNotification: {maxLength: 4096}, Seal: {enum: ['CAR', 'SHI', 'VET', 'CUS'] } },
        DEFAULT                : { type: 'string' },
    },
    specialCertificateNumber: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 255 },
    },
    specversion: {
        PARENTS                : DCSA_CLOUDEVENT_GROUP,
        DEFAULT                : { type: 'string', enum: ['1.0'] },
    },
    stateRegion: {
        'jit_v1.2.0-Beta-2'    : { PARENTS: { address: {} } },
        'BKG_v2.0.0-Beta-2'    : { DEFAULT: { nullable: true } },
        PARENTS                : { Address:{}, address: {}, PartyAddress: {}, City: {} },
        DEFAULT                : { type: 'string', maxLength: 65 },
    },
    statusCode: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { format: null } },
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'integer', format: 'int32' },
    },
    statusCodeMessage: {
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string', maxLength: 200 },
    },
    statusCodeText: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { maxLength: null } },
        PARENTS                : { ErrorResponse: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    street: {
        PARENTS                : { Address: {}, address: {}, PartyAddress: {} },
        DEFAULT                : { type: 'string', maxLength: 70 },
    },
    streetNumber: {
        PARENTS                : { Address: {}, address: {}, PartyAddress: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    subscriptionReference: {
        PARENTS                : DCSA_CLOUDEVENT_GROUP,
        DEFAULT                : { type: 'string', pattern: '^\\S(?:.*\\S)?$', maxLength: 100},
    },
    subsidiaryRisk1: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', minLength: 1, maxLength: 3, pattern: '^[0-9](\\.[0-9])?$' },
    },
    subsidiaryRisk2: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', minLength: 1, maxLength: 3, pattern: '^[0-9](\\.[0-9])?$' },
    },
    supplementaryDeclarantEORINumber: {
        DEFAULT                : { type: 'string', pattern: '^\\S(?:.*\\S)?$', maxLength: 17 },
    },
    SupportingDocument: {
        DEFAULT                : { type: 'object', title: 'Supporting Document', required: ['name', 'content'] },
    },
    supportingDocuments: {
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/DocumentMetadata'} },
    },
    SurrenderRequestAnswer: {
        DEFAULT                : { type: 'object', title: 'Surrender Request Answer', required: ['surrenderRequestReference', 'action'] },
    },
    surrenderRequestCode: {
        DEFAULT                : { type: 'string', enum: ['SREQ', 'AREQ'] },
    },
    SurrenderRequestDetails: {
        DEFAULT                : { type: 'object', title: 'Surrender Request Details', required: ['surrenderRequestReference','transportDocumentReference','surrenderRequestedBy','surrenderRequestCode'] },
    },
    // SurrenderRequestedBy should be deleted
    SurrenderRequestedBy: {
        DEFAULT                : { type: 'object', title: 'Surrender Requested By', required: ['partyName', 'eblPlatform'] },
    },
    surrenderRequestReference: {
        DEFAULT                : { type: 'string', maxLength: 100, pattern: '^\\S(?:.*\\S)?$' },
    },
    tareWeight: {
        PARENTS                : { Equipment: {}, RequestedEquipment: {}, RequestedEquipmentShipper: {}, RequiredEquipment: {} },
        DEFAULT                : { type: 'object', title: 'Tare Weight', required: ['value','unit'], CHILDREN: ['value','unit'] },
    },
    tareWeightUnit: {
        PARENTS                : { RequestedEquipment: {}, RequestedEquipmentShipper: {} },
        DEFAULT                : { type: 'string', enum: ['KGM', 'LBR'] },
    },
    TaxLegalReference: {
        DEFAULT                : { type: 'object', title: 'Tax & Legal Reference', required: ['type', 'countryCode', 'value'], CHILDREN: ['type','countryCode','value'] },
    },
    taxLegalReferences: {
        PARENTS                : { BookingAgent: {}, Shipper: {}, ShipperHBL: {}, Consignee: {}, ConsigneeHBL: {}, Endorsee: {}, ServiceContractOwner: {}, Party: {}, IssuingParty: {}, IssueToParty: {}, TransactionParty: {}, SurrenderRequestedBy: {}, NotifyParty: {}, NotifyPartyHBL: {}, Seller: {}, Buyer: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/TaxLegalReference'} },
    },
    taxReference1: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 20 } },
    },
    taxReference2: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 20 } },
    },
    technicalName: {
        PARENTS                : { DangerousGoods: {} },
        DEFAULT                : { type: 'string', maxLength: 250 },
    },
    temperatureSetpoint: {
        PARENTS                : { ActiveReeferSettings: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    temperatureUnit: {
        PARENTS                : { ActiveReeferSettings: {}, Limits: {} },
        DEFAULT                : { type: 'string', enum: ['CEL', 'FAH'] },
    },
    termsAndConditions: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', maxLength: 50000 },
    },
    time: {
        PARENTS                : DCSA_CLOUDEVENT_GROUP,
        DEFAULT                : { type: 'string', format: 'date-time'},
    },
    Timestamp: {
        DEFAULT                : { type: 'object', title: 'Timestamp', required: ['eventTypeCode', 'eventClassifierCode', 'eventDateTime'], CHILDREN: ['eventTypeCode','eventClassifierCode','eventDateTime'] },
    },
    timestampID: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', format: 'uuid' } },
    },
    timestamps: {
        PARENTS                : { TransportCall: {}, Schedule: {} },
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/Timestamp'} },
    },
    TransactionParty: {
        DEFAULT                : { type: 'object', title: 'Transaction Party', required: ['partyName', 'eblPlatform'] },
    },
    transactions: {
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/Transaction'} },
    },
    transitTime: {
        DEFAULT                : { type: 'integer', format: 'int32' },
    },
    transport: {
        PARENTS                : { Leg: {} },
        DEFAULT                : { },
    },
    Transport: {
        DEFAULT                : { type: 'object', title: 'Transport', required: ['transportPlanStage', 'transportPlanStageSequenceNumber', 'loadLocation', 'dischargeLocation', 'plannedDepartureDate', 'plannedArrivalDate'], CHILDREN: ['transportPlanStage','transportPlanStageSequenceNumber','loadLocation','dischargeLocation','plannedDepartureDate','plannedArrivalDate','modeOfTransport','vesselName','vesselIMONumber','carrierServiceCode','universalServiceReference','carrierImportVoyageNumber','universalImportVoyageReference','carrierExportVoyageNumber','universalExportVoyageReference'] },
    },
    TransportCall: {
        DEFAULT                : { type: 'object', title: 'Transport Call', required: ['transportCallReference', 'carrierImportVoyageNumber', 'timestamps'], CHILDREN: ['portVisitReference','transportCallReference','carrierImportVoyageNumber','carrierExportVoyageNumber','universalImportVoyageReference','universalExportVoyageReference','cutOffTimes','location','timestamps'] },
    },
    transportCallID: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 100 }, PARENTS: { TransportCall: {} } },
    },
    transportCallReference: {
        PARENTS                : { TransportCall: {}, VesselTransport: {}, BargeTransport: {} },
        DEFAULT                : { type: 'string', maxLength: 100 },
    },
    TransportCallLocation: {
        DEFAULT                : { type: 'object', title: 'TransportCall Location', CHILDREN: ['locationName','address','UNLocationCode','facilitySMDGCode'] },
    },
    transportCalls: {
        PARENTS                : { VesselSchedule: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/TransportCall'} },
    },
    transportCallSequenceNumber: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { format: null } },
        DEFAULT                : { type: 'integer', format: 'int32' },
    },
    transportControlTemperature: {
        PARENTS                : { Limits: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    TransportDocument: {
        'EBL_PINT_v3.0.0'    : { DEFAULT: { $ref: '#/components/schemas/TransportDocument' } },
        DEFAULT                : { type: 'object', title: 'Transport Document', required: ['transportDocumentReference', 'transportDocumentStatus', 'transportDocumentTypeCode', 'isShippedOnBoardType', 'isElectronic', 'isToOrder', 'invoicePayableAt', 'partyContactDetails', 'documentParties', 'consignmentItems', 'utilizedTransportEquipments', 'termsAndConditions', 'receiptTypeAtOrigin', 'deliveryTypeAtDestination', 'cargoMovementTypeAtOrigin', 'cargoMovementTypeAtDestination', 'carrierCode', 'carrierCodeListProvider', 'transports'], CHILDREN: ['transportDocumentReference','shippingInstructionsReference','transportDocumentStatus','transportDocumentTypeCode','isShippedOnBoardType','freightPaymentTermCode','isElectronic','isToOrder','numberOfCopiesWithCharges','numberOfCopiesWithoutCharges','numberOfOriginalsWithCharges','numberOfOriginalsWithoutCharges','displayedNameForPlaceOfReceipt','displayedNameForPortOfLoad','displayedNameForPortOfDischarge','displayedNameForPlaceOfDelivery','shippedOnBoardDate','displayedShippedOnBoardReceivedForShipment','termsAndConditions','receiptTypeAtOrigin','deliveryTypeAtDestination','cargoMovementTypeAtOrigin','cargoMovementTypeAtDestination','issueDate','receivedForShipmentDate','serviceContractReference','contractQuotationReference','declaredValue','declaredValueCurrency','carrierCode','carrierCodeListProvider','carrierClauses','numberOfRiderPages','transports','charges','placeOfIssue','invoicePayableAt','partyContactDetails','documentParties','routingOfConsignmentCountries','consignmentItems','utilizedTransportEquipments','references','customsReferences'] },
    },
    transportDocument: {
        DEFAULT                : { basedOn: 'TransportDocument' }
    },
    transportDocumentChecksum: {
        DEFAULT                : { type: 'string', minLength: 64, maxLength: 64, pattern: '^[0-9a-f]+$' },
    },
    TransportDocumentRefStatus: {
        DEFAULT                : { type: 'object', title: 'Transport Document Response', required: ['transportDocumentReference', 'transportDocumentStatus'] },
    },
    TransportDocumentNotification: {
        'ebl_ntf_v3.0.0-Beta-1': { DEFAULT: { required: ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype', 'data'] } },
        DEFAULT                : { type: 'object', title: 'Transport Document Notification', required: ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype', 'subscriptionReference', 'data'] },
    },
    transportDocumentReference: {
        'ebl_ntf_v3.0.0-Beta-1': { DEFAULT: { pattern: "^\\S+(\\s+\\S+)*$" }, PARENTS: { data: {} } }, //BKG NTF 2.0.0 Beta 1
        'EBL_NTF_v3.0.0-Beta-2': { PARENTS: { data: {} }},
        'EBL_NTF_v3.0.0-Beta-3': { PARENTS: { data: {} }},
        PARENTS                : { ShippingInstructions: {}, shippingInstructions: {}, updatedShippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, TransportDocument: {}, transportDocument: {}, TransportDocumentRefStatus: {}, IssuanceResponse: {}, SurrenderRequestAcknowledgement: {}, data: {}, SurrenderRequestDetails: {} },
        DEFAULT                : { type: 'string', maxLength: 20, pattern: '^\\S(?:.*\\S)?$' },
    },
    transportDocumentStatus: {
        'ebl_ntf_v3.0.0-Beta-1': { PARENTS: { data: {} } },
        'EBL_NTF_v3.0.0-Beta-2': { PARENTS: { data: {} } },
        'EBL_NTF_v3.0.0-Beta-3': { PARENTS: { data: {} } },
        PARENTS                : { TransportDocument: {}, transportDocument: {}, TransportDocumentRefStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    transportDocumentTypeCode: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, CreateShippingInstructions: {}, UpdateShippingInstructions: {}, ShippingInstructions: {}, updatedShippingInstructions: {}, shippingInstructions: {}, TransportDocument: {}, transportDocument: {} },
        DEFAULT                : { type: 'string', enum: ['BOL', 'SWB'] },
    },
    transportEmergencyTemperature: {
        PARENTS                : { Limits: {} },
        DEFAULT                : { type: 'number', format: 'float' },
    },
    transportPlan: {
        PARENTS                : { Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { type: 'array', items: {$ref: '#/components/schemas/Transport'} },
    },
    transportPlanStage: {
        PARENTS                : { Transport: {} },
        DEFAULT                : { type: 'string', enum: ['PRC', 'MNC', 'ONC'] },
    },
    transportPlanStageSequenceNumber: {
        PARENTS                : { Transport: {} },
        DEFAULT                : { type: 'integer', format: 'int32' },
    },
    transports: {
        DEFAULT                : { $ref: '#/components/schemas/Transports' },
    },
    Transports: {
        DEFAULT                : { type: 'object', title: 'Transports', required: ['plannedArrivalDate', 'plannedDepartureDate', 'portOfLoading', 'portOfDischarge', 'vesselVoyages'], CHILDREN: ['plannedArrivalDate','plannedDepartureDate','preCarriageBy','onCarriageBy','placeOfReceipt','portOfLoading','portOfDischarge','placeOfDelivery','onwardInlandRouting','vesselVoyages'] },
    },
    type: {
        PARENTS                : { CustomsReference: {maxLength: 50, pattern: '^\\S(?:.*\\S)?$'}, Reference: {maxLength: 3}, ReferenceShipper: {maxLength: 3}, TaxLegalReference: {maxLength: 50, pattern: '^\\S(?:.*\\S)?$'}, ArrivalNoticeNotification: {enum: ['org.dcsa.arrival-notice-notification.v1']}, BookingNotification: {enum: ['org.dcsa.booking.v2']},TransportDocumentNotification: {enum: ['org.dcsa.transport-document.v3']}, ShippingInstructionsNotification: {enum: ['org.dcsa.shipping-instructions.v3']}, vessel: {enum: ['GCGO', 'CONT', 'RORO', 'CARC', 'PASS', 'FERY', 'BULK', 'TANK', 'LGTK', 'ASSI', 'PILO'] }, NationalCommodityCode: {maxLength: 10, pattern: '^\\S(?:.*\\S)?$'} },
        DEFAULT                : { type: 'string' },
    },
    typeOfPerson: {
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$' },
    },
    unit: {
        PARENTS                : { cargoGrossWeight: {enum: ['KGM', 'LBR']}, tareWeight: {enum: ['KGM', 'LBR']}, cargoGrossVolume: {enum: ['MTQ', 'FTQ']}, grossVolume: {enum: ['MTQ', 'FTQ']}, netVolume: {enum: ['MTQ', 'FTQ', 'LTR']}, grossWeight: {enum: ['KGM', 'LBR']}, netWeight: {enum: ['KGM', 'LBR']}, netExplosiveContent: {enum: ['KGM', 'LBR', 'GRM', 'ONZ']} },
        DEFAULT                : { type: 'string' },
    },
    units: {
        PARENTS                : { ConfirmedEquipment: {}, RequestedEquipment: {}, RequestedEquipmentShipper: {} },
        DEFAULT                : { type: 'integer', format: 'int32', minimum: 1 },
    },
    unitPrice: {
        PARENTS                : { Charge: {} },
        DEFAULT                : { type: 'number', format: 'float', minimum: 0 },
    },
    universalExportVoyageReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, Transport: {}, VesselVoyage: {}, Schedule: {}, TransportCall: {}, VesselTransport: {}, BargeTransport: {} },
        DEFAULT                : { type: 'string', minLength: 5, maxLength: 5, pattern: '^\\d{2}[0-9A-Z]{2}[NEWSR]$' },
    },
    universalImportVoyageReference: {
        PARENTS                : { Transport: {}, Schedule: {}, TransportCall: {}, VesselTransport: {}, BargeTransport: {} },
        DEFAULT                : { type: 'string', minLength: 5, maxLength: 5, pattern: '^\\d{2}[0-9A-Z]{2}[NEWSR]$' },
    },
    universalServiceReference: {
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {}, Transport: {}, Schedule: {}, ServiceSchedule: {}, VesselTransport: {}, BargeTransport: {} },
        DEFAULT                : { type: 'string', minLength: 8, maxLength: 8, pattern: '^SR\\d{5}[A-Z]$' },
    },
    UNLocationCode: {
        'jit_v1.2.0-Beta-2'    : { pattern: null },
        DEFAULT                : { type: 'string', minLength: 5, maxLength: 5, pattern: '^[A-Z]{2}[A-Z2-9]{3}$' },
    },
//    UNLocationLocation: {
//        DEFAULT                : { type: 'object', title: 'UNLocation Location', additionalProperties: false, required: ['locationType', 'UNLocationCode'], CHILDREN: ['locationName','locationType','UNLocationCode'] },
//    },
    unNumber: {
        DEFAULT                : { type: 'string', minLength: 4, maxLength: 4, pattern: '^\\d{4}$' },
    },
    UpdateBooking: {
        DEFAULT                : { type: 'object', title: 'Update Booking', required: ['receiptTypeAtOrigin', 'deliveryTypeAtDestination', 'cargoMovementTypeAtOrigin', 'cargoMovementTypeAtDestination', 'isPartialLoadAllowed', 'isExportDeclarationRequired', 'isImportLicenseRequired', 'communicationChannelCode', 'isEquipmentSubstitutionAllowed', 'shipmentLocations', 'requestedEquipments', 'documentParties'] },
    },
    UpdateShippingInstructions: {
        DEFAULT                : { type: 'object', title: 'Update Shipping Instructions', required: ['shippingInstructionsReference', 'transportDocumentTypeCode', 'isShippedOnBoardType', 'isElectronic', 'isToOrder', 'freightPaymentTermCode', 'partyContactDetails', 'documentParties', 'consignmentItems', 'utilizedTransportEquipments'] },
    },
    updatedShippingInstructions: {
        DEFAULT                : { title: 'Updated Shipping Instructions', basedOn: 'ShippingInstructions' },
    },
    updatedShippingInstructionsStatus: {
        'ebl_ntf_v3.0.0-Beta-1'     : { PARENTS: { data: {}}},
        'EBL_NTF_v3.0.0-Beta-2'     : { PARENTS: { data: {}}},
        'EBL_NTF_v3.0.0-Beta-3'     : { PARENTS: { data: {}}},
        PARENTS                : { ShippingInstructions: {}, shippingInstructions: {}, updatedShippingInstructions: {}, ShippingInstructionsRefStatus: {}, ShippingInstructionsRefCancelStatus: {}, data: {} },
        DEFAULT                : { type: 'string', maxLength: 50 },
    },
    UTEquipment: {
        DEFAULT                : { type: 'object', title: 'Shipper Owned Equipment (SoC)', required: ['isShipperOwned', 'equipment'], CHILDREN: ['isShipperOwned','equipment'] },
    },
    UTEquipmentReference: {
        DEFAULT                : { type: 'object', title: 'Carrier Owned Equipment', required: ['isShipperOwned', 'equipmentReference'], CHILDREN:['isShipperOwned','equipmentReference'] },
    },
    UtilizedTransportEquipment: {
        DEFAULT                : { type: 'object', title: 'Utilized Transport Equipment', required: ['equipment', 'isShipperOwned', 'seals'], CHILDREN: ['equipment','isShipperOwned','isNonOperatingReefer','activeReeferSettings','shippingMarks','seals','references','customsReferences'] },
    },
//  UtilizedTransportEquipmentCarrier: {
//    DEFAULT                : { type: 'object', title: 'Utilized Transport Equipment (Carrier)', required: ['equipment', 'isShipperOwned', 'seals'], CHILDREN: ['equipment','isShipperOwned','isNonOperatingReefer','activeReeferSettings','seals','references','customsReferences'] },
//  },
    utilizedTransportEquipments: {
        PARENTS                : { CreateShippingInstructions: {items: {$ref: '#/components/schemas/UtilizedTransportEquipmentShipper'}}, UpdateShippingInstructions: {items: {$ref: '#/components/schemas/UtilizedTransportEquipmentShipper'}}, ShippingInstructions: {items: {$ref: '#/components/schemas/UtilizedTransportEquipmentShipper'}}, shippingInstructions: {items: {$ref: '#/components/schemas/UtilizedTransportEquipmentShipper'}}, updatedShippingInstructions: {items: {$ref: '#/components/schemas/UtilizedTransportEquipmentShipper'}}, TransportDocument: {items: {$ref: '#/components/schemas/UtilizedTransportEquipment'} }, transportDocument: { items: {$ref: '#/components/schemas/UtilizedTransportEquipment'} } },
        DEFAULT                : { type: 'array', minItems: 1 },
    },
    UtilizedTransportEquipmentShipper: {
        DEFAULT                : { type: 'object', title: 'Utilized Transport Equipment (Shipper)', required: ['seals'], oneOf: true, CHILDREN: ['shippingMarks','seals','references','customsReferences']},
    },
    value: {
        PARENTS                : {
                                    tareWeight: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    grossVolume: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    cargoGrossVolume: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    netVolume: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true},
                                    cargoGrossWeight: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    grossWeight: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    netWeight: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    netExplosiveContent: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, 
                                    DetailedError: {type: 'string', maxLength: 500},
                                    errors: {type: 'string', maxLength: 500}, 
                                    TaxLegalReference: {type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$'}, 
                                    Reference: {type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$'},
                                    ReferenceShipper: {type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$'}, 
                                 },
    },
    values: {
        PARENTS                : { NationalCommodityCode: {}, CustomsReference: { items: {type: 'string', maxLength: 35, pattern: '^\\S(?:.*\\S)?$' } } },
        DEFAULT                : { type: 'array', minItems: 1, items: {type: 'string', maxLength: 10, pattern: '^\\S(?:.*\\S)?$' } },
    },
    vessel: {
        'CS_v1.0.0'             : { DEFAULT: { type: null, title: null, required: null, CHILDREN: null, $ref: '#/components/schemas/Vessel' } },
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { title: null, required: null }, PARENTS: { timestamp: {}, TransportCall: {} } },
        PARENTS                : { CreateBooking: {}, UpdateBooking: {}, Booking: {}, booking: {}, amendedBooking: {} },
        DEFAULT                : { $ref: '#/components/schemas/Vessel' },
    },
    Vessel: {
        'BKG_v2.0.0'           : { DEFAULT: { type: 'object', title: 'Vessel', required: ['name'], CHILDREN: ['name','vesselIMONumber'] } },
        DEFAULT                : { type: 'object', title: 'Vessel', CHILDREN: ['vesselIMONumber','MMSINumber','name','flag','callSign','operatorCarrierCode','operatorCarrierCodeListProvider'] },
    },
    vesselCallSign: {
        PARENTS                : {  VesselSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 10, pattern: '^\\S(?:.*\\S)?$' },
    },
    vesselCallSignNumber: {
        'jit_v1.2.0-Beta-2'    : { PARENTS: { vessel: {} } },
        PARENTS                : { VesselSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 10 },
    },
    vesselDraft: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'number', format: 'float' }, PARENTS: { OperationsEvent: {} } },
    },
    vesselDraftUnit: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', enum: ['MTR', 'FOT'] }, PARENTS: { OperationsEvent: {} } },
    },
    vesselFlag: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { type: 'string', maxLength: 2 }, PARENTS: { vessel: {} } },
    },
    vesselIMONumber: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { minLength: 7, maxLength: 8, pattern: null }, PARENTS: { timestamp: {deprecated: true}, vessel: {} }},
        PARENTS                : { vessel: {}, Vessel: {}, Transport: {}, VesselVoyage: {}, Barge: {} },
        DEFAULT                : { type: 'string', minLength: 7, maxLength: 8, pattern: '^\\d{7,8}$' },
    },
    vesselName: {
        'jit_v1.2.0-Beta-2'    : { DEFAULT: { maxLength: 35, pattern: null }, PARENTS: { vessel: {} } },
        PARENTS                : { Transport: {}, VesselVoyage: {}, VesselSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 50, pattern: '^\\S(?:.*\\S)?$' },
    },
    vesselOperatorCarrierCode: {
        PARENTS                : { vessel: {nullable: false}, Schedule: {}, VesselSchedule: {} },
        DEFAULT                : { type: 'string', maxLength: 10 },
    },
    vesselOperatorCarrierCodeListProvider: {
        PARENTS                : { vessel: {nullable: false}, Schedule: {}, VesselSchedule: {} },
        DEFAULT                : { type: 'string', enum: ['SMDG', 'NMFTA'] },
    },
    vesselPosition: {
        'jit_v1.2.0-Beta-2'    : { $ref: true },
    },
    VesselSchedule: {
        DEFAULT                : { type: 'object', title: 'Vessel Schedule', required: ['isDummyVessel'], CHILDREN: ['vessel','isDummyVessel','transportCalls'] },
    },
    vesselSchedules: {
        PARENTS                : { ServiceSchedule: { minItems: 1, items: {$ref: '#/components/schemas/VesselSchedule'} }, PortSchedule: { items: { $ref: '#/components/schemas/Schedule' } } },
        DEFAULT                : { type: 'array' },
    },
    VesselTransport: {
        DEFAULT                : { type: 'object', title: 'Vessel Transport', required: ['modeOfTransport'], CHILDREN: ['modeOfTransport','portVisitReference','transportCallReference','servicePartners','universalServiceReference','universalExportVoyageReference','universalImportVoyageReference','vessel'] },
    },
    VesselVoyage: {
        DEFAULT                : { type: 'object', title: 'Vessel/Voyage', required: ['vesselName', 'carrierExportVoyageNumber'], CHILDREN: ['vesselName','carrierExportVoyageNumber','universalExportVoyageReference'] },
    },
    vesselVoyages: {
        DEFAULT                : { type: 'array', minItems: 1, items: {$ref: '#/components/schemas/VesselVoyage'} },
    },
    //volume: {
    //    PARENTS                : { CargoItemCarrier: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, CargoItemShipper: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true}, CargoItem: {type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true} },
    //},
    //volumeUnit: {
    //    PARENTS                : { CargoItemCarrier: {}, CargoItemShipper: {}, CargoItem: {} },
    //    DEFAULT                : { type: 'string', enum: ['MTQ', 'FTQ'] },
    //},
    //weight: {
    //    PARENTS                : { CargoItemCarrier: {}, CargoItemShipper: {}, CargoItem: {} },
    //    DEFAULT                : { type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true },
    //},
    weightUnit: {
        PARENTS                : { Equipment: {}, RequiredEquipment: {} },
        DEFAULT                : { type: 'string', enum: ['KGM', 'LBR'] },
    },
    width: {
        PARENTS                : { vessel: {} },
        'jit_v1.2.0-Beta-2'    : { type: 'number', format: 'float' },
    },
    woodDeclaration: {
        PARENTS                : { OuterPackaging: {}, OuterPackagingShipper: {} },
        DEFAULT                : { type: 'string', maxLength: 30 },
    },
};


// Makes sure two arrays are equal if:
// * they are the same array
// * they have the same size
// * items on each position in the list are the same
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// input:         the property (Node) in the API to validate
// propertyName:  the name of the property being tested (can be a simpleType or an object)
// attribute:     the attribute to test (type, minLength, required, etc...) if specified correctly
// requirements:  the list of attributes that from the Spectral rule that is valid
// results:       an accumulated list of errors for a particular property
function checkRequirement(input, propertyName, attribute, requirements, results) {
    // Checking 'enum' attribute
    if (attribute === 'enum') {
        // Check that enum values match (= are specified the same way...)
        const enumValuesRequired = requirements[attribute];
        const enumValues = input[attribute];
        if (!arraysEqual(enumValues, enumValuesRequired)) {
            // The two enum lists do not match - file an error
            results.push( { message: propertyName + `.` + attribute + ` value must equal: [` + enumValuesRequired + `], value provided: [` + enumValues + `]`, }, );
        }
        // Checking 'required' attribute
    } else if (attribute === 'required') {
        // Check that required lists match (= are specified the same way...)
        const requiredValues = requirements[attribute];
        const inputValues = input[attribute];
        if (!arraysEqual(inputValues, requiredValues)) {
            // The two required lists do not match - file an error
            results.push( { message: propertyName + `.` + attribute + ` value must equal: [` + requiredValues + `], value provided: [` + inputValues + `]`, }, );
        }
        // Checking 'items' attribute
    } else if (attribute === 'items') {
        if (input['items'] && requirements['items']) {
            // Check if a $ref MUST be used
            if (Object.keys(input['items']).length === 1 && input['items']['$ref']) {
                // the input contains a $ref
                if (requirements['items']['$ref'] !== input['items']['$ref']) {
                    results.push( { message: propertyName + `.` + attribute + ` is defined as a $ref pointing to '` + input['items']['$ref'] + `' - but must be defined ` + (requirements['items']['$ref'] ? `as a $ref pointing to: ` + requirements['items']['$ref'] : `inline`), }, );
                }
            } else if (Object.keys(requirements['items']).length === 1 && requirements['items']['$ref']) {
                // the spec requires a $ref
                if (input['items']['$ref'] !== requirements['items']['$ref']) {
                    results.push( { message: propertyName + `.` + attribute + ` is not defined as a $ref and MUST point to: ` + requirements['items']['$ref'], }, );
                }
            } else {
                // Multiple properties defined for an inline defined items
                for (const attribute2 of ATTRIBUTES_TO_CHECK) {
                    checkRequirement(input.items, propertyName + '.items', attribute2, requirements.items, results)
                }
            }
        } else {
            if (input['items']) {
                // input.items is defined - but it is not part of the required properties
                results.push( { message: propertyName + `.` + attribute + ` value defined but shouldn't be according to the rules`, }, );
            } else if (requirements['items']) {
                // requirements.items is defined - but it is not part of the input properties
                results.push( { message: propertyName + `.` + attribute + ` value is missing - MUST be defined`, }, );
            }
        }
        // Checking a specific attribute
    } else if (requirements[attribute] !== input[attribute]) {
        // The value provided and the value required does not match - file an error
        results.push( { message: propertyName + `.` + attribute + ` value must equal: ` + requirements[attribute] + `, value provided: ` + input[attribute], }, );
    }

    // Make sure type attributes that are strings have example attribute value set
    if (attribute === 'type' && requirements[attribute] === "string" && (!input['example'] || input['example'].length === 0)) {
        // Example value missing when type=string - file an error
        results.push( { message: propertyName + `.example attribute must be set with a value`, }, );
    }
}

// spec:          the accumulated spec to validate against in all uses of a property
// propertyName:  the name of the property being tested (can be a simpleType or an object)
// input:         the property (Node) in the API to validate
// results:       an accumulated list of errors for a particular property
function checkAttributeRequirements(spec, propertyName, input, results) {
    // Test valid $ref specifications
    if (input && Object.keys(input).length === 1 && input['$ref']) {
        // Make sure correct use of $ref is used
        if (spec && spec['$ref']) {
            if (spec['$ref'] !== input['$ref']) {
                results.push({ message: propertyName + ` - if not defined inline it MUST use a $ref pointing to: ` + spec['$ref'] + ` (currently pointing to: ` + input['$ref'] +`)`, }, );
            }
        } else {
            // The attribute exists only in the API - NOT as a Spectral rule - file an error
            results.push( { message: propertyName + `.$ref is specified - but should be removed as it is not a required attribute`, }, );
        }
        // Don't validate anything else - if specified using a $ref - it must match and nothing else
        return;
    }

    // Run through all properties to check
    for (const attribute of ATTRIBUTES_TO_CHECK) {
        // Check if the property is used in the API
        if (input && input[attribute]) {
            // ...and check if it also exists in the spec
            if (spec && spec[attribute]) {
                checkRequirement(input, propertyName, attribute, spec, results);
            } else {
                // The attribute exists only in the API - NOT in the spec - file an error
                results.push( { message: propertyName + `.` + attribute + ` is specified - but should be removed as it is not a required attribute`, }, );
            }
        } else if (spec && spec[attribute]) {
            // The attribute exists in the spec - NOT in the API
            if (attribute === 'enum' || attribute === 'required') {
                // Provide better error message for missing enum
                results.push( { message: propertyName + `.` + attribute + ` must contain the list: [` + spec[attribute] + `] but nothing was provided`, }, );
            } else {
                results.push( { message: propertyName + `.` + attribute + ` value must equal: ` + spec[attribute] + ` but nothing was provided`, }, );
            }
        } else {
            // In none of the lists - there is no requirement for this attribute
        }
    }

    if (input && input['type'] && input['type'] === 'object' && spec['CHILDREN']) {
//    if (input.properties && !arraysEqual(Object.keys(input.properties), spec['CHILDREN'])) {
        if (input.properties && !arraysEqual(Array.from(Object.keys(input.properties)), spec['CHILDREN'])) {
            // The two enum lists do not match - file an error
            results.push( { message: propertyName + ` MUST have the following children: [` + spec['CHILDREN'] + `], value provided: [` + Object.keys(input.properties) + `]`, }, );
        }
        //  results.push( { message: propertyName + ` looking for children: ` + JSON.stringify(Object.keys(input.properties)) + spec['CHILDREN'], }, );
    }
}

// specA:          the accumulated spec for the property
// specB:          the spec to merge into the accumulated spec. Null removes a property, otherwise it will be added or updated
// includeParentProperty: weather to use this method to also copy the PARENTS property
function mergeSpecs(specA, specB, includeParentProperty) {
    // Make sure specB exists
    if (specB) {
        // Run through all elements in specB
        for (const [key, value] of Object.entries(specB)) {
            // If value of key in specB is null
            if (!value) {
                // ...and it exists in specA
                specA[key] = undefined;
//        if (specA[key]) {
//          // ...then delete the key in specA!
//          //delete specA[key];
//        }
                // If the key already exists in specA
            } else if (includeParentProperty || key !== 'PARENTS') {
                // ...then update or add the value in specA
                specA[key] = value;
            }
        }
    }
}

// spec:          the spec as defined for the current location
// parentSpec:    the spec as defined for the specific parent node
// context:       a StopLight object containing metadata about the API property being tested
// index:         the parent index of the context.path currently being checked
// results:       an accumulated list of errors for a particular property
// returns true if location is matched - false if the property is not allowed
function checkParent(spec, parentSpec, context, index, results) {
    // Check if parentSpec is defined
    if (parentSpec) {
        // Find the index of the parentName
        const newIndex = ((context.path.length > (3 + index)) && (context.path[context.path.length - (3 + index)] === 'items')) ?
            (4 + index) : (3 + index);
        // Get the parentName
        const parentPropertyName = context.path[context.path.length - newIndex];
        // Check if the parent spec has defined something for the parentName
        if (parentSpec[parentPropertyName]) {
            // ...if so - merge the spec of the parentSpec with the accumulated spec (excluding PARENTS property)
            mergeSpecs(spec, parentSpec[parentPropertyName], false);
            // ...and recursively check next parent
            return checkParent(spec, parentSpec[parentPropertyName]['PARENTS'], context, newIndex, results);
        } else {
            // Check if we are in a oneOf situation
            if (/^[0-9]+$/.test(parentPropertyName) && (context.path.length > (newIndex + 2)) && parentSpec[context.path[context.path.length - (newIndex + 2)]]) {
                mergeSpecs(spec, parentSpec[context.path[context.path.length - (newIndex + 2)]], false);
                return checkParent(spec, parentSpec[context.path[context.path.length - (newIndex + 2)]]['PARENTS'], context, newIndex + 2, results);
            } else {
                // If the parentName does not exist in the parentSpec - then the property is not allowed in that particular position
                results.push( { message: context.path[context.path.length - 1] + ` is only allowed under one of these parents: [` + Object.keys(parentSpec) + `] - was found under: ` + parentPropertyName, }, );
                return false;
            }
        }
    } else {
        return true;
    }
}

// property:      the Spectral spec to validate against
// standard:      the name of the OAS file (without ".yaml"-extension)
// propertyName:  the name of the property being tested (can be a simpleType or an object)
// input:         the property (Node) in the API to validate
// context:       a StopLight object containing metadata about the API property being tested
// specs:         the specs to test against
//
function checkStandard(property, standard, propertyName, input, context, specs, results) {
    // Gather all errors in results
//    const results = [];

//    let specs = {};
    if (property['DEFAULT'] && property['DEFAULT'].basedOn) {
        const basedOnPropertyName = property['DEFAULT'].basedOn;
        checkStandard(DCSA_PROPERTIES[basedOnPropertyName], standard, basedOnPropertyName, input, context, specs, results);
    }
    mergeSpecs(specs, property['DEFAULT'], false);

    // Merge with standard specific specs (if any)
    const standardProperty = property[standard];
    if (standardProperty) {
        mergeSpecs(specs, standardProperty['DEFAULT'], false);
    }

    // Check if parent requirements should be checked
    if (!NO_PARENT_CHECK.has(standard)) {
        let parentSpecs = {};
        if (standardProperty) {
            // Use the PARENTS from the standard
            mergeSpecs(parentSpecs, standardProperty['PARENTS'], true);
//      if (propertyName === 'documentParties') {
//        results.push( { message: `**** parentSpecs: [` + Object.keys(parentSpecs) + `]`, }, );
//      }
        } else {
            // Use the PARENTS from the default
            mergeSpecs(parentSpecs, property['PARENTS'], true);
        }

        // Only merge a possible parent requirement if one has been defined
        if (!isEmptyObject(parentSpecs)) {
            let resultingParentSpecs = {};
            if (checkParent(resultingParentSpecs, parentSpecs, context, 0, results)) {
                mergeSpecs(specs, resultingParentSpecs)
            }
        }
    }
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}

function isEmptyObject(value) {
    if (value == null) {
        // null or undefined
        return false;
    }

    if (typeof value !== 'object') {
        // boolean, number, string, function, etc.
        return false;
    }

    const proto = Object.getPrototypeOf(value);

    // consider `Object.create(null)`, commonly used as a safe map
    // before `Map` support, an empty object as well as `{}`
    if (proto !== null && proto !== Object.prototype) {
        return false;
    }

    return isEmpty(value);
}

export default createRulesetFunction(
    {
        input: null,
        options: null,
    },
    function checkRequirements(input, options, context) {
        // Get propertyName to check based on the path in the Context
        const propertyName = context.path[context.path.length - 1];

        // Get the Standard being tested (this excludes the '.yaml' e.g.: jit_v1.2.0-Beta-2)
        const standard = context['document']['source'].substring(context['document']['source'].lastIndexOf('/') + 1, context['document']['source'].length - 5);

        // Check if the standard is in the list of standards that is currently covered by Spectral
        if (COVERED_STANDARDS.has(standard)) {
            // Get the property in the list of DCSA_PROPERTIES
            const property = DCSA_PROPERTIES[propertyName];
            if (property) {
                // Gather all errors in results
                const results = [];
                // Gather the specs to check against
                let specs = {};
                checkStandard(property, standard, propertyName, input, context, specs, results);
                //results.push( { message: propertyName + ` specs: [` + Object.keys(specs) + `]`, }, );

                // Specs is now correct in regard to specification and location
                checkAttributeRequirements(specs, propertyName, input, results);

                // Only return a list if it contains something - StopLight requirement!!
                if (results.length > 0) {
                    return results;
                }
            } else {
                // the property name not part of DCSA_PROPERTIES
                if (ERROR_ON_UNSUPPORTED_PROPERTIES) {
                    return [ { message: propertyName + ` is not in the list of DCSA supported property names` + hello(), }, ];
                }
            }
        }
    }
);
