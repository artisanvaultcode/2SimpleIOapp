import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum EntityStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PROCESS = "PROCESS",
  SENT = "SENT",
  WL = "WL",
  BL = "BL"
}

export enum Carriers {
  TWILIO = "TWILIO",
  PHONE = "PHONE",
  NOTASSIGNED = "NOTASSIGNED"
}

export enum TemplateUsage {
  DEFAULT = "DEFAULT",
  NONE = "NONE"
}

export enum MontlyLimit {
  TWOK = "TWOK",
  TENK = "TENK",
  UNLIMITED = "UNLIMITED",
  TRIAL = "TRIAL"
}

export enum SubsStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

export enum CampaignTargetOptions {
  ALL = "ALL",
  GROUP = "GROUP",
  SELECTION = "SELECTION"
}

export enum CampaignTypeOptions {
  EXPRESS = "EXPRESS",
  SCHEDULED = "SCHEDULED"
}

export enum CampaignStatus {
  DEFINED = "DEFINED",
  PROCESSING = "PROCESSING",
  PAUSE = "PAUSE",
  COMPLETED = "COMPLETED"
}

export enum CampaignTargetStatus {
  ACTIVE = "ACTIVE",
  PROCESSING = "PROCESSING",
  SENT = "SENT"
}



type GroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MsgTemplateMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RecipientMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MsgToGroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DeviceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type HisSmsLogMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SubscriberMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CampaignMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CampaignTargetMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MemberCreditsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Group {
  readonly id: string;
  readonly name?: string;
  readonly carrier?: Carriers | keyof typeof Carriers;
  readonly status?: EntityStatus | keyof typeof EntityStatus;
  readonly MsgTemplate?: MsgTemplate;
  readonly msgTemplateId?: string;
  readonly clientId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Group, GroupMetaData>);
  static copyOf(source: Group, mutator: (draft: MutableModel<Group, GroupMetaData>) => MutableModel<Group, GroupMetaData> | void): Group;
}

export declare class MsgTemplate {
  readonly id: string;
  readonly name?: string;
  readonly message?: string;
  readonly status?: EntityStatus | keyof typeof EntityStatus;
  readonly default?: TemplateUsage | keyof typeof TemplateUsage;
  readonly clientId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<MsgTemplate, MsgTemplateMetaData>);
  static copyOf(source: MsgTemplate, mutator: (draft: MutableModel<MsgTemplate, MsgTemplateMetaData>) => MutableModel<MsgTemplate, MsgTemplateMetaData> | void): MsgTemplate;
}

export declare class Recipient {
  readonly id: string;
  readonly phone?: string;
  readonly carrierStatus?: string;
  readonly lastProcessDt?: string;
  readonly Group?: Group;
  readonly groupId?: string;
  readonly phoneTxt?: string;
  readonly status?: EntityStatus | keyof typeof EntityStatus;
  readonly archive?: boolean;
  readonly clientId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Recipient, RecipientMetaData>);
  static copyOf(source: Recipient, mutator: (draft: MutableModel<Recipient, RecipientMetaData>) => MutableModel<Recipient, RecipientMetaData> | void): Recipient;
}

export declare class MsgToGroup {
  readonly id: string;
  readonly msgID: string;
  readonly groupID: string;
  readonly clientId?: string;
  readonly status?: EntityStatus | keyof typeof EntityStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<MsgToGroup, MsgToGroupMetaData>);
  static copyOf(source: MsgToGroup, mutator: (draft: MutableModel<MsgToGroup, MsgToGroupMetaData>) => MutableModel<MsgToGroup, MsgToGroupMetaData> | void): MsgToGroup;
}

export declare class Device {
  readonly id: string;
  readonly uniqueId?: string;
  readonly description?: string;
  readonly metadata?: string;
  readonly lastProcessDt?: string;
  readonly phoneTxt?: string;
  readonly status?: EntityStatus | keyof typeof EntityStatus;
  readonly clientId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Device, DeviceMetaData>);
  static copyOf(source: Device, mutator: (draft: MutableModel<Device, DeviceMetaData>) => MutableModel<Device, DeviceMetaData> | void): Device;
}

export declare class HisSmsLog {
  readonly id: string;
  readonly uniqueId?: string;
  readonly clientId: string;
  readonly clientIdTxt?: string;
  readonly lastProcessDt?: string;
  readonly metadata?: string;
  readonly carrierStatus?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<HisSmsLog, HisSmsLogMetaData>);
  static copyOf(source: HisSmsLog, mutator: (draft: MutableModel<HisSmsLog, HisSmsLogMetaData>) => MutableModel<HisSmsLog, HisSmsLogMetaData> | void): HisSmsLog;
}

export declare class Subscriber {
  readonly id: string;
  readonly apiKey: string;
  readonly clientId: string;
  readonly limit?: MontlyLimit | keyof typeof MontlyLimit;
  readonly limitMax?: number;
  readonly currentCount?: number;
  readonly expires?: string;
  readonly lastProcessDt?: string;
  readonly metadata?: string;
  readonly status?: SubsStatus | keyof typeof SubsStatus;
  readonly confirmCount?: number;
  readonly transitCount?: number;
  readonly creditCount?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Subscriber, SubscriberMetaData>);
  static copyOf(source: Subscriber, mutator: (draft: MutableModel<Subscriber, SubscriberMetaData>) => MutableModel<Subscriber, SubscriberMetaData> | void): Subscriber;
}

export declare class Campaign {
  readonly id: string;
  readonly clientId: string;
  readonly name?: string;
  readonly target?: CampaignTargetOptions | keyof typeof CampaignTargetOptions;
  readonly groupId?: string;
  readonly message?: string;
  readonly lastProcessDt?: string;
  readonly metadata?: string;
  readonly status?: SubsStatus | keyof typeof SubsStatus;
  readonly archive?: boolean;
  readonly cType?: CampaignTypeOptions | keyof typeof CampaignTypeOptions;
  readonly dateStart?: string;
  readonly timeStart?: string;
  readonly epocStart?: string;
  readonly cStatus?: CampaignStatus | keyof typeof CampaignStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Campaign, CampaignMetaData>);
  static copyOf(source: Campaign, mutator: (draft: MutableModel<Campaign, CampaignMetaData>) => MutableModel<Campaign, CampaignMetaData> | void): Campaign;
}

export declare class CampaignTarget {
  readonly id: string;
  readonly campaignId: string;
  readonly recipientId?: string;
  readonly recipient?: Recipient;
  readonly lastProcessDt?: string;
  readonly status?: CampaignTargetStatus | keyof typeof CampaignTargetStatus;
  readonly groupId?: string;
  readonly group?: Group;
  readonly type?: CampaignTargetOptions | keyof typeof CampaignTargetOptions;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<CampaignTarget, CampaignTargetMetaData>);
  static copyOf(source: CampaignTarget, mutator: (draft: MutableModel<CampaignTarget, CampaignTargetMetaData>) => MutableModel<CampaignTarget, CampaignTargetMetaData> | void): CampaignTarget;
}

export declare class MemberCredits {
  readonly id: string;
  readonly clientId: string;
  readonly qty: number;
  readonly confirmationId: string;
  readonly amount: number;
  readonly amountTxt: string;
  readonly stripeCustomer: string;
  readonly paymentDetails: string;
  readonly lastProcessDt?: string;
  readonly receiptUrl: string;
  readonly paymentStatus: string;
  readonly metaData?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<MemberCredits, MemberCreditsMetaData>);
  static copyOf(source: MemberCredits, mutator: (draft: MutableModel<MemberCredits, MemberCreditsMetaData>) => MutableModel<MemberCredits, MemberCreditsMetaData> | void): MemberCredits;
}