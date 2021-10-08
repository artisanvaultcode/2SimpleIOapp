// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const EntityStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE",
  "PROCESS": "PROCESS",
  "SENT": "SENT",
  "WL": "WL",
  "BL": "BL"
};

const Carriers = {
  "TWILIO": "TWILIO",
  "PHONE": "PHONE",
  "NOTASSIGNED": "NOTASSIGNED"
};

const TemplateUsage = {
  "DEFAULT": "DEFAULT",
  "NONE": "NONE"
};

const MontlyLimit = {
  "TWOK": "TWOK",
  "TENK": "TENK",
  "UNLIMITED": "UNLIMITED",
  "TRIAL": "TRIAL"
};

const SubsStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE",
  "SUSPENDED": "SUSPENDED"
};

const { Group, Recipient, MsgTemplate, MsgToGroup, Device, HisSmsLog, Subscriber } = initSchema(schema);

export {
  Group,
  Recipient,
  MsgTemplate,
  MsgToGroup,
  Device,
  HisSmsLog,
  Subscriber,
  EntityStatus,
  Carriers,
  TemplateUsage,
  MontlyLimit,
  SubsStatus
};