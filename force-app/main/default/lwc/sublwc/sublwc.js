import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNTING_UPDATED_CHANNEL from '@salesforce/messageChannel/Counting_Update__c';

export default class SubLWC extends LightningElement {
    counter = 0;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            COUNTING_UPDATED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    name;

    handleMessage(message) {
        if (message.operator === 'add') {
            this.counter += message.constant;
        } else if (message.operator === 'subtract') {
            this.counter -= message.constant;
        } else if (message.operator === 'multiply') {
            this.counter *= message.constant;
        }else if (message.operator ==='name') {
            this.name = message.constant;
        }
    }
}
