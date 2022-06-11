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

const CampaignTargetOptions = {
  "ALL": "ALL",
  "GROUP": "GROUP",
  "SELECTION": "SELECTION"
};

const CampaignTypeOptions = {
  "EXPRESS": "EXPRESS",
  "SCHEDULED": "SCHEDULED"
};

const CampaignStatus = {
  "DEFINED": "DEFINED",
  "PROCESSING": "PROCESSING",
  "PAUSE": "PAUSE",
  "COMPLETED": "COMPLETED"
};

const CampaignTargetStatus = {
  "ACTIVE": "ACTIVE",
  "PROCESSING": "PROCESSING",
  "SENT": "SENT"
};

const { Group, MsgTemplate, Recipient, MsgToGroup, Device, HisSmsLog, Subscriber, Campaign, CampaignTarget, MemberCredits } = initSchema(schema);

export {
  Group,
  MsgTemplate,
  Recipient,
  MsgToGroup,
  Device,
  HisSmsLog,
  Subscriber,
  Campaign,
  CampaignTarget,
  MemberCredits,
  EntityStatus,
  Carriers,
  TemplateUsage,
  MontlyLimit,
  SubsStatus,
  CampaignTargetOptions,
  CampaignTypeOptions,
  CampaignStatus,
  CampaignTargetStatus
};