import {EntityStatus, TemplateUsage} from '../../../../API.service';

export class MessageModel
{
    id: string;
    name?: string | null;
    message?: string | null;
    status?: EntityStatus | null;
    default?: TemplateUsage | null;
    clientId?: string | null;
    _version: number;
    createdAt: string;
    updatedAt: string;

    /**
     * Constructor
     *
     * @param resource
     */
    constructor(resource?) {
        resource = resource ? resource : {};
        this.id = resource.id || '';
        this.name = resource.name || 'Type a Title Here';
        this.message = resource.message || 'Type a Message Here';
        this.status = resource.status || EntityStatus.ACTIVE;
        this.default = resource.default || TemplateUsage.DEFAULT ;
        this.clientId = resource.clientId || null;
        this.createdAt = resource.createdAt || new Date().toUTCString();
        this.updatedAt = resource.updatedAt || new Date().toUTCString();
        this._version = resource._version || null;
    }
}
