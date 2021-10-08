/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type CreateGroupInput = {
  id?: string | null;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version?: number | null;
};

export enum Carriers {
  TWILIO = "TWILIO",
  PHONE = "PHONE",
  NOTASSIGNED = "NOTASSIGNED"
}

export enum EntityStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PROCESS = "PROCESS",
  SENT = "SENT",
  WL = "WL",
  BL = "BL"
}

export type ModelGroupConditionInput = {
  name?: ModelStringInput | null;
  carrier?: ModelCarriersInput | null;
  status?: ModelEntityStatusInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelGroupConditionInput | null> | null;
  or?: Array<ModelGroupConditionInput | null> | null;
  not?: ModelGroupConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelCarriersInput = {
  eq?: Carriers | null;
  ne?: Carriers | null;
};

export type ModelEntityStatusInput = {
  eq?: EntityStatus | null;
  ne?: EntityStatus | null;
};

export type Group = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateGroupInput = {
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version?: number | null;
};

export type DeleteGroupInput = {
  id: string;
  _version?: number | null;
};

export type CreateRecipientInput = {
  id?: string | null;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version?: number | null;
  recipientGroupId?: string | null;
  recipientMsgTemplateId?: string | null;
};

export type ModelRecipientConditionInput = {
  phone?: ModelStringInput | null;
  carrierStatus?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  phoneTxt?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelRecipientConditionInput | null> | null;
  or?: Array<ModelRecipientConditionInput | null> | null;
  not?: ModelRecipientConditionInput | null;
};

export type Recipient = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: Group | null;
  MsgTemplate?: MsgTemplate | null;
};

export type MsgTemplate = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export enum TemplateUsage {
  DEFAULT = "DEFAULT",
  NONE = "NONE"
}

export type UpdateRecipientInput = {
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version?: number | null;
  _deleted?: boolean | null;
  recipientGroupId?: string | null;
  recipientMsgTemplateId?: string | null;
};

export type DeleteRecipientInput = {
  id: string;
  _version?: number | null;
};

export type CreateMsgTemplateInput = {
  id?: string | null;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version?: number | null;
};

export type ModelMsgTemplateConditionInput = {
  name?: ModelStringInput | null;
  message?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  default?: ModelTemplateUsageInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelMsgTemplateConditionInput | null> | null;
  or?: Array<ModelMsgTemplateConditionInput | null> | null;
  not?: ModelMsgTemplateConditionInput | null;
};

export type ModelTemplateUsageInput = {
  eq?: TemplateUsage | null;
  ne?: TemplateUsage | null;
};

export type UpdateMsgTemplateInput = {
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version?: number | null;
};

export type DeleteMsgTemplateInput = {
  id: string;
  _version?: number | null;
};

export type CreateMsgToGroupInput = {
  id?: string | null;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version?: number | null;
};

export type ModelMsgToGroupConditionInput = {
  msgID?: ModelIDInput | null;
  groupID?: ModelIDInput | null;
  clientId?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  and?: Array<ModelMsgToGroupConditionInput | null> | null;
  or?: Array<ModelMsgToGroupConditionInput | null> | null;
  not?: ModelMsgToGroupConditionInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type MsgToGroup = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateMsgToGroupInput = {
  id: string;
  msgID?: string | null;
  groupID?: string | null;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version?: number | null;
};

export type DeleteMsgToGroupInput = {
  id: string;
  _version?: number | null;
};

export type CreateDeviceInput = {
  id?: string | null;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version?: number | null;
};

export type ModelDeviceConditionInput = {
  uniqueId?: ModelStringInput | null;
  description?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  phoneTxt?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  and?: Array<ModelDeviceConditionInput | null> | null;
  or?: Array<ModelDeviceConditionInput | null> | null;
  not?: ModelDeviceConditionInput | null;
};

export type Device = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDeviceInput = {
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version?: number | null;
};

export type DeleteDeviceInput = {
  id: string;
  _version?: number | null;
};

export type CreateHisSmsLogInput = {
  id?: string | null;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version?: number | null;
};

export type ModelHisSmsLogConditionInput = {
  uniqueId?: ModelStringInput | null;
  clientId?: ModelIDInput | null;
  clientIdTxt?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  carrierStatus?: ModelStringInput | null;
  and?: Array<ModelHisSmsLogConditionInput | null> | null;
  or?: Array<ModelHisSmsLogConditionInput | null> | null;
  not?: ModelHisSmsLogConditionInput | null;
};

export type HisSmsLog = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateHisSmsLogInput = {
  id: string;
  uniqueId?: string | null;
  clientId?: string | null;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version?: number | null;
};

export type DeleteHisSmsLogInput = {
  id: string;
  _version?: number | null;
};

export type CreateSubscriberInput = {
  id?: string | null;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version?: number | null;
};

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

export type ModelSubscriberConditionInput = {
  apiKey?: ModelStringInput | null;
  clientId?: ModelIDInput | null;
  limit?: ModelMontlyLimitInput | null;
  limitMax?: ModelStringInput | null;
  currentCount?: ModelStringInput | null;
  expires?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  status?: ModelSubsStatusInput | null;
  and?: Array<ModelSubscriberConditionInput | null> | null;
  or?: Array<ModelSubscriberConditionInput | null> | null;
  not?: ModelSubscriberConditionInput | null;
};

export type ModelMontlyLimitInput = {
  eq?: MontlyLimit | null;
  ne?: MontlyLimit | null;
};

export type ModelSubsStatusInput = {
  eq?: SubsStatus | null;
  ne?: SubsStatus | null;
};

export type Subscriber = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSubscriberInput = {
  id: string;
  apiKey?: string | null;
  clientId?: string | null;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version?: number | null;
};

export type DeleteSubscriberInput = {
  id: string;
  _version?: number | null;
};

export type ModelGroupFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  carrier?: ModelCarriersInput | null;
  status?: ModelEntityStatusInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelGroupFilterInput | null> | null;
  or?: Array<ModelGroupFilterInput | null> | null;
  not?: ModelGroupFilterInput | null;
};

export type ModelGroupConnection = {
  __typename: "ModelGroupConnection";
  items?: Array<Group | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelRecipientFilterInput = {
  id?: ModelIDInput | null;
  phone?: ModelStringInput | null;
  carrierStatus?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  phoneTxt?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelRecipientFilterInput | null> | null;
  or?: Array<ModelRecipientFilterInput | null> | null;
  not?: ModelRecipientFilterInput | null;
};

export type ModelRecipientConnection = {
  __typename: "ModelRecipientConnection";
  items?: Array<Recipient | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SearchableRecipientFilterInput = {
  id?: SearchableIDFilterInput | null;
  phone?: SearchableStringFilterInput | null;
  carrierStatus?: SearchableStringFilterInput | null;
  lastProcessDt?: SearchableStringFilterInput | null;
  phoneTxt?: SearchableStringFilterInput | null;
  clientId?: SearchableStringFilterInput | null;
  and?: Array<SearchableRecipientFilterInput | null> | null;
  or?: Array<SearchableRecipientFilterInput | null> | null;
  not?: SearchableRecipientFilterInput | null;
};

export type SearchableIDFilterInput = {
  ne?: string | null;
  gt?: string | null;
  lt?: string | null;
  gte?: string | null;
  lte?: string | null;
  eq?: string | null;
  match?: string | null;
  matchPhrase?: string | null;
  matchPhrasePrefix?: string | null;
  multiMatch?: string | null;
  exists?: boolean | null;
  wildcard?: string | null;
  regexp?: string | null;
  range?: Array<string | null> | null;
};

export type SearchableStringFilterInput = {
  ne?: string | null;
  gt?: string | null;
  lt?: string | null;
  gte?: string | null;
  lte?: string | null;
  eq?: string | null;
  match?: string | null;
  matchPhrase?: string | null;
  matchPhrasePrefix?: string | null;
  multiMatch?: string | null;
  exists?: boolean | null;
  wildcard?: string | null;
  regexp?: string | null;
  range?: Array<string | null> | null;
};

export type SearchableRecipientSortInput = {
  field?: SearchableRecipientSortableFields | null;
  direction?: SearchableSortDirection | null;
};

export enum SearchableRecipientSortableFields {
  id = "id",
  phone = "phone",
  carrierStatus = "carrierStatus",
  lastProcessDt = "lastProcessDt",
  phoneTxt = "phoneTxt",
  clientId = "clientId"
}

export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc"
}

export type SearchableRecipientConnection = {
  __typename: "SearchableRecipientConnection";
  items?: Array<Recipient | null> | null;
  nextToken?: string | null;
  total?: number | null;
};

export type ModelMsgTemplateFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  message?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  default?: ModelTemplateUsageInput | null;
  clientId?: ModelStringInput | null;
  and?: Array<ModelMsgTemplateFilterInput | null> | null;
  or?: Array<ModelMsgTemplateFilterInput | null> | null;
  not?: ModelMsgTemplateFilterInput | null;
};

export type ModelMsgTemplateConnection = {
  __typename: "ModelMsgTemplateConnection";
  items?: Array<MsgTemplate | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelMsgToGroupFilterInput = {
  id?: ModelIDInput | null;
  msgID?: ModelIDInput | null;
  groupID?: ModelIDInput | null;
  clientId?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  and?: Array<ModelMsgToGroupFilterInput | null> | null;
  or?: Array<ModelMsgToGroupFilterInput | null> | null;
  not?: ModelMsgToGroupFilterInput | null;
};

export type ModelMsgToGroupConnection = {
  __typename: "ModelMsgToGroupConnection";
  items?: Array<MsgToGroup | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelDeviceFilterInput = {
  id?: ModelIDInput | null;
  uniqueId?: ModelStringInput | null;
  description?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  phoneTxt?: ModelStringInput | null;
  status?: ModelEntityStatusInput | null;
  and?: Array<ModelDeviceFilterInput | null> | null;
  or?: Array<ModelDeviceFilterInput | null> | null;
  not?: ModelDeviceFilterInput | null;
};

export type ModelDeviceConnection = {
  __typename: "ModelDeviceConnection";
  items?: Array<Device | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SearchableDeviceFilterInput = {
  id?: SearchableIDFilterInput | null;
  uniqueId?: SearchableStringFilterInput | null;
  description?: SearchableStringFilterInput | null;
  metadata?: SearchableStringFilterInput | null;
  lastProcessDt?: SearchableStringFilterInput | null;
  phoneTxt?: SearchableStringFilterInput | null;
  and?: Array<SearchableDeviceFilterInput | null> | null;
  or?: Array<SearchableDeviceFilterInput | null> | null;
  not?: SearchableDeviceFilterInput | null;
};

export type SearchableDeviceSortInput = {
  field?: SearchableDeviceSortableFields | null;
  direction?: SearchableSortDirection | null;
};

export enum SearchableDeviceSortableFields {
  id = "id",
  uniqueId = "uniqueId",
  description = "description",
  metadata = "metadata",
  lastProcessDt = "lastProcessDt",
  phoneTxt = "phoneTxt"
}

export type SearchableDeviceConnection = {
  __typename: "SearchableDeviceConnection";
  items?: Array<Device | null> | null;
  nextToken?: string | null;
  total?: number | null;
};

export type ModelHisSmsLogFilterInput = {
  id?: ModelIDInput | null;
  uniqueId?: ModelStringInput | null;
  clientId?: ModelIDInput | null;
  clientIdTxt?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  carrierStatus?: ModelStringInput | null;
  and?: Array<ModelHisSmsLogFilterInput | null> | null;
  or?: Array<ModelHisSmsLogFilterInput | null> | null;
  not?: ModelHisSmsLogFilterInput | null;
};

export type ModelHisSmsLogConnection = {
  __typename: "ModelHisSmsLogConnection";
  items?: Array<HisSmsLog | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelSubscriberFilterInput = {
  id?: ModelIDInput | null;
  apiKey?: ModelStringInput | null;
  clientId?: ModelIDInput | null;
  limit?: ModelMontlyLimitInput | null;
  limitMax?: ModelStringInput | null;
  currentCount?: ModelStringInput | null;
  expires?: ModelStringInput | null;
  lastProcessDt?: ModelStringInput | null;
  metadata?: ModelStringInput | null;
  status?: ModelSubsStatusInput | null;
  and?: Array<ModelSubscriberFilterInput | null> | null;
  or?: Array<ModelSubscriberFilterInput | null> | null;
  not?: ModelSubscriberFilterInput | null;
};

export type ModelSubscriberConnection = {
  __typename: "ModelSubscriberConnection";
  items?: Array<Subscriber | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type CreateGroupMutation = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateGroupMutation = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteGroupMutation = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateRecipientMutation = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateRecipientMutation = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteRecipientMutation = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateMsgTemplateMutation = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateMsgTemplateMutation = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteMsgTemplateMutation = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateMsgToGroupMutation = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateMsgToGroupMutation = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteMsgToGroupMutation = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateDeviceMutation = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDeviceMutation = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteDeviceMutation = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateHisSmsLogMutation = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateHisSmsLogMutation = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteHisSmsLogMutation = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubscriberMutation = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSubscriberMutation = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteSubscriberMutation = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type GetGroupQuery = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListGroupsQuery = {
  __typename: "ModelGroupConnection";
  items?: Array<{
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncGroupsQuery = {
  __typename: "ModelGroupConnection";
  items?: Array<{
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRecipientQuery = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListRecipientsQuery = {
  __typename: "ModelRecipientConnection";
  items?: Array<{
    __typename: "Recipient";
    id: string;
    phone?: string | null;
    carrierStatus?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
    Group?: {
      __typename: "Group";
      id: string;
      name?: string | null;
      carrier?: Carriers | null;
      status?: EntityStatus | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
    MsgTemplate?: {
      __typename: "MsgTemplate";
      id: string;
      name?: string | null;
      message?: string | null;
      status?: EntityStatus | null;
      default?: TemplateUsage | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SearchRecipientsQuery = {
  __typename: "SearchableRecipientConnection";
  items?: Array<{
    __typename: "Recipient";
    id: string;
    phone?: string | null;
    carrierStatus?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
    Group?: {
      __typename: "Group";
      id: string;
      name?: string | null;
      carrier?: Carriers | null;
      status?: EntityStatus | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
    MsgTemplate?: {
      __typename: "MsgTemplate";
      id: string;
      name?: string | null;
      message?: string | null;
      status?: EntityStatus | null;
      default?: TemplateUsage | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
  } | null> | null;
  nextToken?: string | null;
  total?: number | null;
};

export type SyncRecipientsQuery = {
  __typename: "ModelRecipientConnection";
  items?: Array<{
    __typename: "Recipient";
    id: string;
    phone?: string | null;
    carrierStatus?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
    Group?: {
      __typename: "Group";
      id: string;
      name?: string | null;
      carrier?: Carriers | null;
      status?: EntityStatus | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
    MsgTemplate?: {
      __typename: "MsgTemplate";
      id: string;
      name?: string | null;
      message?: string | null;
      status?: EntityStatus | null;
      default?: TemplateUsage | null;
      clientId?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetMsgTemplateQuery = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListMsgTemplatesQuery = {
  __typename: "ModelMsgTemplateConnection";
  items?: Array<{
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncMsgTemplatesQuery = {
  __typename: "ModelMsgTemplateConnection";
  items?: Array<{
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetMsgToGroupQuery = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListMsgToGroupsQuery = {
  __typename: "ModelMsgToGroupConnection";
  items?: Array<{
    __typename: "MsgToGroup";
    id: string;
    msgID: string;
    groupID: string;
    clientId?: string | null;
    status?: EntityStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncMsgToGroupsQuery = {
  __typename: "ModelMsgToGroupConnection";
  items?: Array<{
    __typename: "MsgToGroup";
    id: string;
    msgID: string;
    groupID: string;
    clientId?: string | null;
    status?: EntityStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetDeviceQuery = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListDevicesQuery = {
  __typename: "ModelDeviceConnection";
  items?: Array<{
    __typename: "Device";
    id: string;
    uniqueId?: string | null;
    description?: string | null;
    metadata?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SearchDevicesQuery = {
  __typename: "SearchableDeviceConnection";
  items?: Array<{
    __typename: "Device";
    id: string;
    uniqueId?: string | null;
    description?: string | null;
    metadata?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  total?: number | null;
};

export type SyncDevicesQuery = {
  __typename: "ModelDeviceConnection";
  items?: Array<{
    __typename: "Device";
    id: string;
    uniqueId?: string | null;
    description?: string | null;
    metadata?: string | null;
    lastProcessDt?: string | null;
    phoneTxt?: string | null;
    status?: EntityStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetHisSmsLogQuery = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListHisSmsLogsQuery = {
  __typename: "ModelHisSmsLogConnection";
  items?: Array<{
    __typename: "HisSmsLog";
    id: string;
    uniqueId?: string | null;
    clientId: string;
    clientIdTxt?: string | null;
    lastProcessDt?: string | null;
    metadata?: string | null;
    carrierStatus?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncHisSmsLogsQuery = {
  __typename: "ModelHisSmsLogConnection";
  items?: Array<{
    __typename: "HisSmsLog";
    id: string;
    uniqueId?: string | null;
    clientId: string;
    clientIdTxt?: string | null;
    lastProcessDt?: string | null;
    metadata?: string | null;
    carrierStatus?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetSubscriberQuery = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type ListSubscribersQuery = {
  __typename: "ModelSubscriberConnection";
  items?: Array<{
    __typename: "Subscriber";
    id: string;
    apiKey: string;
    clientId: string;
    limit?: MontlyLimit | null;
    limitMax?: string | null;
    currentCount?: string | null;
    expires?: string | null;
    lastProcessDt?: string | null;
    metadata?: string | null;
    status?: SubsStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncSubscribersQuery = {
  __typename: "ModelSubscriberConnection";
  items?: Array<{
    __typename: "Subscriber";
    id: string;
    apiKey: string;
    clientId: string;
    limit?: MontlyLimit | null;
    limitMax?: string | null;
    currentCount?: string | null;
    expires?: string | null;
    lastProcessDt?: string | null;
    metadata?: string | null;
    status?: SubsStatus | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type OnCreateGroupSubscription = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateGroupSubscription = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteGroupSubscription = {
  __typename: "Group";
  id: string;
  name?: string | null;
  carrier?: Carriers | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateRecipientSubscription = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateRecipientSubscription = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteRecipientSubscription = {
  __typename: "Recipient";
  id: string;
  phone?: string | null;
  carrierStatus?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
  Group?: {
    __typename: "Group";
    id: string;
    name?: string | null;
    carrier?: Carriers | null;
    status?: EntityStatus | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  MsgTemplate?: {
    __typename: "MsgTemplate";
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateMsgTemplateSubscription = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateMsgTemplateSubscription = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteMsgTemplateSubscription = {
  __typename: "MsgTemplate";
  id: string;
  name?: string | null;
  message?: string | null;
  status?: EntityStatus | null;
  default?: TemplateUsage | null;
  clientId?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateMsgToGroupSubscription = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateMsgToGroupSubscription = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteMsgToGroupSubscription = {
  __typename: "MsgToGroup";
  id: string;
  msgID: string;
  groupID: string;
  clientId?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateDeviceSubscription = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateDeviceSubscription = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteDeviceSubscription = {
  __typename: "Device";
  id: string;
  uniqueId?: string | null;
  description?: string | null;
  metadata?: string | null;
  lastProcessDt?: string | null;
  phoneTxt?: string | null;
  status?: EntityStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateHisSmsLogSubscription = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateHisSmsLogSubscription = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteHisSmsLogSubscription = {
  __typename: "HisSmsLog";
  id: string;
  uniqueId?: string | null;
  clientId: string;
  clientIdTxt?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  carrierStatus?: string | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateSubscriberSubscription = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateSubscriberSubscription = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteSubscriberSubscription = {
  __typename: "Subscriber";
  id: string;
  apiKey: string;
  clientId: string;
  limit?: MontlyLimit | null;
  limitMax?: string | null;
  currentCount?: string | null;
  expires?: string | null;
  lastProcessDt?: string | null;
  metadata?: string | null;
  status?: SubsStatus | null;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateGroup(
    input: CreateGroupInput,
    condition?: ModelGroupConditionInput
  ): Promise<CreateGroupMutation> {
    const statement = `mutation CreateGroup($input: CreateGroupInput!, $condition: ModelGroupConditionInput) {
        createGroup(input: $input, condition: $condition) {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateGroupMutation>response.data.createGroup;
  }
  async UpdateGroup(
    input: UpdateGroupInput,
    condition?: ModelGroupConditionInput
  ): Promise<UpdateGroupMutation> {
    const statement = `mutation UpdateGroup($input: UpdateGroupInput!, $condition: ModelGroupConditionInput) {
        updateGroup(input: $input, condition: $condition) {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateGroupMutation>response.data.updateGroup;
  }
  async DeleteGroup(
    input: DeleteGroupInput,
    condition?: ModelGroupConditionInput
  ): Promise<DeleteGroupMutation> {
    const statement = `mutation DeleteGroup($input: DeleteGroupInput!, $condition: ModelGroupConditionInput) {
        deleteGroup(input: $input, condition: $condition) {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteGroupMutation>response.data.deleteGroup;
  }
  async CreateRecipient(
    input: CreateRecipientInput,
    condition?: ModelRecipientConditionInput
  ): Promise<CreateRecipientMutation> {
    const statement = `mutation CreateRecipient($input: CreateRecipientInput!, $condition: ModelRecipientConditionInput) {
        createRecipient(input: $input, condition: $condition) {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateRecipientMutation>response.data.createRecipient;
  }
  async UpdateRecipient(
    input: UpdateRecipientInput,
    condition?: ModelRecipientConditionInput
  ): Promise<UpdateRecipientMutation> {
    const statement = `mutation UpdateRecipient($input: UpdateRecipientInput!, $condition: ModelRecipientConditionInput) {
        updateRecipient(input: $input, condition: $condition) {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateRecipientMutation>response.data.updateRecipient;
  }
  async DeleteRecipient(
    input: DeleteRecipientInput,
    condition?: ModelRecipientConditionInput
  ): Promise<DeleteRecipientMutation> {
    const statement = `mutation DeleteRecipient($input: DeleteRecipientInput!, $condition: ModelRecipientConditionInput) {
        deleteRecipient(input: $input, condition: $condition) {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteRecipientMutation>response.data.deleteRecipient;
  }
  async CreateMsgTemplate(
    input: CreateMsgTemplateInput,
    condition?: ModelMsgTemplateConditionInput
  ): Promise<CreateMsgTemplateMutation> {
    const statement = `mutation CreateMsgTemplate($input: CreateMsgTemplateInput!, $condition: ModelMsgTemplateConditionInput) {
        createMsgTemplate(input: $input, condition: $condition) {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateMsgTemplateMutation>response.data.createMsgTemplate;
  }
  async UpdateMsgTemplate(
    input: UpdateMsgTemplateInput,
    condition?: ModelMsgTemplateConditionInput
  ): Promise<UpdateMsgTemplateMutation> {
    const statement = `mutation UpdateMsgTemplate($input: UpdateMsgTemplateInput!, $condition: ModelMsgTemplateConditionInput) {
        updateMsgTemplate(input: $input, condition: $condition) {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateMsgTemplateMutation>response.data.updateMsgTemplate;
  }
  async DeleteMsgTemplate(
    input: DeleteMsgTemplateInput,
    condition?: ModelMsgTemplateConditionInput
  ): Promise<DeleteMsgTemplateMutation> {
    const statement = `mutation DeleteMsgTemplate($input: DeleteMsgTemplateInput!, $condition: ModelMsgTemplateConditionInput) {
        deleteMsgTemplate(input: $input, condition: $condition) {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteMsgTemplateMutation>response.data.deleteMsgTemplate;
  }
  async CreateMsgToGroup(
    input: CreateMsgToGroupInput,
    condition?: ModelMsgToGroupConditionInput
  ): Promise<CreateMsgToGroupMutation> {
    const statement = `mutation CreateMsgToGroup($input: CreateMsgToGroupInput!, $condition: ModelMsgToGroupConditionInput) {
        createMsgToGroup(input: $input, condition: $condition) {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateMsgToGroupMutation>response.data.createMsgToGroup;
  }
  async UpdateMsgToGroup(
    input: UpdateMsgToGroupInput,
    condition?: ModelMsgToGroupConditionInput
  ): Promise<UpdateMsgToGroupMutation> {
    const statement = `mutation UpdateMsgToGroup($input: UpdateMsgToGroupInput!, $condition: ModelMsgToGroupConditionInput) {
        updateMsgToGroup(input: $input, condition: $condition) {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateMsgToGroupMutation>response.data.updateMsgToGroup;
  }
  async DeleteMsgToGroup(
    input: DeleteMsgToGroupInput,
    condition?: ModelMsgToGroupConditionInput
  ): Promise<DeleteMsgToGroupMutation> {
    const statement = `mutation DeleteMsgToGroup($input: DeleteMsgToGroupInput!, $condition: ModelMsgToGroupConditionInput) {
        deleteMsgToGroup(input: $input, condition: $condition) {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteMsgToGroupMutation>response.data.deleteMsgToGroup;
  }
  async CreateDevice(
    input: CreateDeviceInput,
    condition?: ModelDeviceConditionInput
  ): Promise<CreateDeviceMutation> {
    const statement = `mutation CreateDevice($input: CreateDeviceInput!, $condition: ModelDeviceConditionInput) {
        createDevice(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateDeviceMutation>response.data.createDevice;
  }
  async UpdateDevice(
    input: UpdateDeviceInput,
    condition?: ModelDeviceConditionInput
  ): Promise<UpdateDeviceMutation> {
    const statement = `mutation UpdateDevice($input: UpdateDeviceInput!, $condition: ModelDeviceConditionInput) {
        updateDevice(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateDeviceMutation>response.data.updateDevice;
  }
  async DeleteDevice(
    input: DeleteDeviceInput,
    condition?: ModelDeviceConditionInput
  ): Promise<DeleteDeviceMutation> {
    const statement = `mutation DeleteDevice($input: DeleteDeviceInput!, $condition: ModelDeviceConditionInput) {
        deleteDevice(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteDeviceMutation>response.data.deleteDevice;
  }
  async CreateHisSmsLog(
    input: CreateHisSmsLogInput,
    condition?: ModelHisSmsLogConditionInput
  ): Promise<CreateHisSmsLogMutation> {
    const statement = `mutation CreateHisSmsLog($input: CreateHisSmsLogInput!, $condition: ModelHisSmsLogConditionInput) {
        createHisSmsLog(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateHisSmsLogMutation>response.data.createHisSmsLog;
  }
  async UpdateHisSmsLog(
    input: UpdateHisSmsLogInput,
    condition?: ModelHisSmsLogConditionInput
  ): Promise<UpdateHisSmsLogMutation> {
    const statement = `mutation UpdateHisSmsLog($input: UpdateHisSmsLogInput!, $condition: ModelHisSmsLogConditionInput) {
        updateHisSmsLog(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateHisSmsLogMutation>response.data.updateHisSmsLog;
  }
  async DeleteHisSmsLog(
    input: DeleteHisSmsLogInput,
    condition?: ModelHisSmsLogConditionInput
  ): Promise<DeleteHisSmsLogMutation> {
    const statement = `mutation DeleteHisSmsLog($input: DeleteHisSmsLogInput!, $condition: ModelHisSmsLogConditionInput) {
        deleteHisSmsLog(input: $input, condition: $condition) {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteHisSmsLogMutation>response.data.deleteHisSmsLog;
  }
  async CreateSubscriber(
    input: CreateSubscriberInput,
    condition?: ModelSubscriberConditionInput
  ): Promise<CreateSubscriberMutation> {
    const statement = `mutation CreateSubscriber($input: CreateSubscriberInput!, $condition: ModelSubscriberConditionInput) {
        createSubscriber(input: $input, condition: $condition) {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateSubscriberMutation>response.data.createSubscriber;
  }
  async UpdateSubscriber(
    input: UpdateSubscriberInput,
    condition?: ModelSubscriberConditionInput
  ): Promise<UpdateSubscriberMutation> {
    const statement = `mutation UpdateSubscriber($input: UpdateSubscriberInput!, $condition: ModelSubscriberConditionInput) {
        updateSubscriber(input: $input, condition: $condition) {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSubscriberMutation>response.data.updateSubscriber;
  }
  async DeleteSubscriber(
    input: DeleteSubscriberInput,
    condition?: ModelSubscriberConditionInput
  ): Promise<DeleteSubscriberMutation> {
    const statement = `mutation DeleteSubscriber($input: DeleteSubscriberInput!, $condition: ModelSubscriberConditionInput) {
        deleteSubscriber(input: $input, condition: $condition) {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteSubscriberMutation>response.data.deleteSubscriber;
  }
  async GetGroup(id: string): Promise<GetGroupQuery> {
    const statement = `query GetGroup($id: ID!) {
        getGroup(id: $id) {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetGroupQuery>response.data.getGroup;
  }
  async ListGroups(
    filter?: ModelGroupFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListGroupsQuery> {
    const statement = `query ListGroups($filter: ModelGroupFilterInput, $limit: Int, $nextToken: String) {
        listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListGroupsQuery>response.data.listGroups;
  }
  async SyncGroups(
    filter?: ModelGroupFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncGroupsQuery> {
    const statement = `query SyncGroups($filter: ModelGroupFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncGroups(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncGroupsQuery>response.data.syncGroups;
  }
  async GetRecipient(id: string): Promise<GetRecipientQuery> {
    const statement = `query GetRecipient($id: ID!) {
        getRecipient(id: $id) {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetRecipientQuery>response.data.getRecipient;
  }
  async ListRecipients(
    filter?: ModelRecipientFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListRecipientsQuery> {
    const statement = `query ListRecipients($filter: ModelRecipientFilterInput, $limit: Int, $nextToken: String) {
        listRecipients(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            phone
            carrierStatus
            lastProcessDt
            phoneTxt
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
            Group {
              __typename
              id
              name
              carrier
              status
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
            MsgTemplate {
              __typename
              id
              name
              message
              status
              default
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListRecipientsQuery>response.data.listRecipients;
  }
  async SearchRecipients(
    filter?: SearchableRecipientFilterInput,
    sort?: SearchableRecipientSortInput,
    limit?: number,
    nextToken?: string,
    from?: number
  ): Promise<SearchRecipientsQuery> {
    const statement = `query SearchRecipients($filter: SearchableRecipientFilterInput, $sort: SearchableRecipientSortInput, $limit: Int, $nextToken: String, $from: Int) {
        searchRecipients(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken, from: $from) {
          __typename
          items {
            __typename
            id
            phone
            carrierStatus
            lastProcessDt
            phoneTxt
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
            Group {
              __typename
              id
              name
              carrier
              status
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
            MsgTemplate {
              __typename
              id
              name
              message
              status
              default
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
          }
          nextToken
          total
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (sort) {
      gqlAPIServiceArguments.sort = sort;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (from) {
      gqlAPIServiceArguments.from = from;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SearchRecipientsQuery>response.data.searchRecipients;
  }
  async SyncRecipients(
    filter?: ModelRecipientFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncRecipientsQuery> {
    const statement = `query SyncRecipients($filter: ModelRecipientFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncRecipients(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            phone
            carrierStatus
            lastProcessDt
            phoneTxt
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
            Group {
              __typename
              id
              name
              carrier
              status
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
            MsgTemplate {
              __typename
              id
              name
              message
              status
              default
              clientId
              _version
              _deleted
              _lastChangedAt
              createdAt
              updatedAt
            }
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncRecipientsQuery>response.data.syncRecipients;
  }
  async GetMsgTemplate(id: string): Promise<GetMsgTemplateQuery> {
    const statement = `query GetMsgTemplate($id: ID!) {
        getMsgTemplate(id: $id) {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetMsgTemplateQuery>response.data.getMsgTemplate;
  }
  async ListMsgTemplates(
    filter?: ModelMsgTemplateFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListMsgTemplatesQuery> {
    const statement = `query ListMsgTemplates($filter: ModelMsgTemplateFilterInput, $limit: Int, $nextToken: String) {
        listMsgTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListMsgTemplatesQuery>response.data.listMsgTemplates;
  }
  async SyncMsgTemplates(
    filter?: ModelMsgTemplateFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncMsgTemplatesQuery> {
    const statement = `query SyncMsgTemplates($filter: ModelMsgTemplateFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncMsgTemplates(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncMsgTemplatesQuery>response.data.syncMsgTemplates;
  }
  async GetMsgToGroup(id: string): Promise<GetMsgToGroupQuery> {
    const statement = `query GetMsgToGroup($id: ID!) {
        getMsgToGroup(id: $id) {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetMsgToGroupQuery>response.data.getMsgToGroup;
  }
  async ListMsgToGroups(
    filter?: ModelMsgToGroupFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListMsgToGroupsQuery> {
    const statement = `query ListMsgToGroups($filter: ModelMsgToGroupFilterInput, $limit: Int, $nextToken: String) {
        listMsgToGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            msgID
            groupID
            clientId
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListMsgToGroupsQuery>response.data.listMsgToGroups;
  }
  async SyncMsgToGroups(
    filter?: ModelMsgToGroupFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncMsgToGroupsQuery> {
    const statement = `query SyncMsgToGroups($filter: ModelMsgToGroupFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncMsgToGroups(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            msgID
            groupID
            clientId
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncMsgToGroupsQuery>response.data.syncMsgToGroups;
  }
  async GetDevice(id: string): Promise<GetDeviceQuery> {
    const statement = `query GetDevice($id: ID!) {
        getDevice(id: $id) {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetDeviceQuery>response.data.getDevice;
  }
  async ListDevices(
    filter?: ModelDeviceFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListDevicesQuery> {
    const statement = `query ListDevices($filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String) {
        listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            uniqueId
            description
            metadata
            lastProcessDt
            phoneTxt
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListDevicesQuery>response.data.listDevices;
  }
  async SearchDevices(
    filter?: SearchableDeviceFilterInput,
    sort?: SearchableDeviceSortInput,
    limit?: number,
    nextToken?: string,
    from?: number
  ): Promise<SearchDevicesQuery> {
    const statement = `query SearchDevices($filter: SearchableDeviceFilterInput, $sort: SearchableDeviceSortInput, $limit: Int, $nextToken: String, $from: Int) {
        searchDevices(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken, from: $from) {
          __typename
          items {
            __typename
            id
            uniqueId
            description
            metadata
            lastProcessDt
            phoneTxt
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          total
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (sort) {
      gqlAPIServiceArguments.sort = sort;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (from) {
      gqlAPIServiceArguments.from = from;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SearchDevicesQuery>response.data.searchDevices;
  }
  async SyncDevices(
    filter?: ModelDeviceFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncDevicesQuery> {
    const statement = `query SyncDevices($filter: ModelDeviceFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncDevices(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            uniqueId
            description
            metadata
            lastProcessDt
            phoneTxt
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncDevicesQuery>response.data.syncDevices;
  }
  async GetHisSmsLog(id: string): Promise<GetHisSmsLogQuery> {
    const statement = `query GetHisSmsLog($id: ID!) {
        getHisSmsLog(id: $id) {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetHisSmsLogQuery>response.data.getHisSmsLog;
  }
  async ListHisSmsLogs(
    filter?: ModelHisSmsLogFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListHisSmsLogsQuery> {
    const statement = `query ListHisSmsLogs($filter: ModelHisSmsLogFilterInput, $limit: Int, $nextToken: String) {
        listHisSmsLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            uniqueId
            clientId
            clientIdTxt
            lastProcessDt
            metadata
            carrierStatus
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListHisSmsLogsQuery>response.data.listHisSmsLogs;
  }
  async SyncHisSmsLogs(
    filter?: ModelHisSmsLogFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncHisSmsLogsQuery> {
    const statement = `query SyncHisSmsLogs($filter: ModelHisSmsLogFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncHisSmsLogs(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            uniqueId
            clientId
            clientIdTxt
            lastProcessDt
            metadata
            carrierStatus
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncHisSmsLogsQuery>response.data.syncHisSmsLogs;
  }
  async GetSubscriber(id: string): Promise<GetSubscriberQuery> {
    const statement = `query GetSubscriber($id: ID!) {
        getSubscriber(id: $id) {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSubscriberQuery>response.data.getSubscriber;
  }
  async ListSubscribers(
    filter?: ModelSubscriberFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSubscribersQuery> {
    const statement = `query ListSubscribers($filter: ModelSubscriberFilterInput, $limit: Int, $nextToken: String) {
        listSubscribers(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            apiKey
            clientId
            limit
            limitMax
            currentCount
            expires
            lastProcessDt
            metadata
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSubscribersQuery>response.data.listSubscribers;
  }
  async SyncSubscribers(
    filter?: ModelSubscriberFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncSubscribersQuery> {
    const statement = `query SyncSubscribers($filter: ModelSubscriberFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncSubscribers(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            apiKey
            clientId
            limit
            limitMax
            currentCount
            expires
            lastProcessDt
            metadata
            status
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncSubscribersQuery>response.data.syncSubscribers;
  }
  OnCreateGroupListener: Observable<
    SubscriptionResponse<OnCreateGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateGroup {
        onCreateGroup {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateGroupSubscription>>;

  OnUpdateGroupListener: Observable<
    SubscriptionResponse<OnUpdateGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateGroup {
        onUpdateGroup {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateGroupSubscription>>;

  OnDeleteGroupListener: Observable<
    SubscriptionResponse<OnDeleteGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteGroup {
        onDeleteGroup {
          __typename
          id
          name
          carrier
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteGroupSubscription>>;

  OnCreateRecipientListener: Observable<
    SubscriptionResponse<OnCreateRecipientSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateRecipient {
        onCreateRecipient {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateRecipientSubscription>>;

  OnUpdateRecipientListener: Observable<
    SubscriptionResponse<OnUpdateRecipientSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateRecipient {
        onUpdateRecipient {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateRecipientSubscription>>;

  OnDeleteRecipientListener: Observable<
    SubscriptionResponse<OnDeleteRecipientSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteRecipient {
        onDeleteRecipient {
          __typename
          id
          phone
          carrierStatus
          lastProcessDt
          phoneTxt
          status
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          Group {
            __typename
            id
            name
            carrier
            status
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
          MsgTemplate {
            __typename
            id
            name
            message
            status
            default
            clientId
            _version
            _deleted
            _lastChangedAt
            createdAt
            updatedAt
          }
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteRecipientSubscription>>;

  OnCreateMsgTemplateListener: Observable<
    SubscriptionResponse<OnCreateMsgTemplateSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateMsgTemplate {
        onCreateMsgTemplate {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateMsgTemplateSubscription>>;

  OnUpdateMsgTemplateListener: Observable<
    SubscriptionResponse<OnUpdateMsgTemplateSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateMsgTemplate {
        onUpdateMsgTemplate {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateMsgTemplateSubscription>>;

  OnDeleteMsgTemplateListener: Observable<
    SubscriptionResponse<OnDeleteMsgTemplateSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteMsgTemplate {
        onDeleteMsgTemplate {
          __typename
          id
          name
          message
          status
          default
          clientId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteMsgTemplateSubscription>>;

  OnCreateMsgToGroupListener: Observable<
    SubscriptionResponse<OnCreateMsgToGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateMsgToGroup {
        onCreateMsgToGroup {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateMsgToGroupSubscription>>;

  OnUpdateMsgToGroupListener: Observable<
    SubscriptionResponse<OnUpdateMsgToGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateMsgToGroup {
        onUpdateMsgToGroup {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateMsgToGroupSubscription>>;

  OnDeleteMsgToGroupListener: Observable<
    SubscriptionResponse<OnDeleteMsgToGroupSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteMsgToGroup {
        onDeleteMsgToGroup {
          __typename
          id
          msgID
          groupID
          clientId
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteMsgToGroupSubscription>>;

  OnCreateDeviceListener: Observable<
    SubscriptionResponse<OnCreateDeviceSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDevice {
        onCreateDevice {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateDeviceSubscription>>;

  OnUpdateDeviceListener: Observable<
    SubscriptionResponse<OnUpdateDeviceSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateDevice {
        onUpdateDevice {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateDeviceSubscription>>;

  OnDeleteDeviceListener: Observable<
    SubscriptionResponse<OnDeleteDeviceSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteDevice {
        onDeleteDevice {
          __typename
          id
          uniqueId
          description
          metadata
          lastProcessDt
          phoneTxt
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteDeviceSubscription>>;

  OnCreateHisSmsLogListener: Observable<
    SubscriptionResponse<OnCreateHisSmsLogSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateHisSmsLog {
        onCreateHisSmsLog {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateHisSmsLogSubscription>>;

  OnUpdateHisSmsLogListener: Observable<
    SubscriptionResponse<OnUpdateHisSmsLogSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateHisSmsLog {
        onUpdateHisSmsLog {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateHisSmsLogSubscription>>;

  OnDeleteHisSmsLogListener: Observable<
    SubscriptionResponse<OnDeleteHisSmsLogSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteHisSmsLog {
        onDeleteHisSmsLog {
          __typename
          id
          uniqueId
          clientId
          clientIdTxt
          lastProcessDt
          metadata
          carrierStatus
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteHisSmsLogSubscription>>;

  OnCreateSubscriberListener: Observable<
    SubscriptionResponse<OnCreateSubscriberSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateSubscriber {
        onCreateSubscriber {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnCreateSubscriberSubscription>>;

  OnUpdateSubscriberListener: Observable<
    SubscriptionResponse<OnUpdateSubscriberSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateSubscriber {
        onUpdateSubscriber {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnUpdateSubscriberSubscription>>;

  OnDeleteSubscriberListener: Observable<
    SubscriptionResponse<OnDeleteSubscriberSubscription>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteSubscriber {
        onDeleteSubscriber {
          __typename
          id
          apiKey
          clientId
          limit
          limitMax
          currentCount
          expires
          lastProcessDt
          metadata
          status
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<SubscriptionResponse<OnDeleteSubscriberSubscription>>;
}
