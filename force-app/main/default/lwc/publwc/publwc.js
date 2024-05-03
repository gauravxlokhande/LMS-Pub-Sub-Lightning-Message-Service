import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from "lightning/messageService";
import COUNTING_UPDATED_CHANNEL from '@salesforce/messageChannel/Counting_Update__c';

export default class PubLWC extends LightningElement {
    @wire(MessageContext)
    messageContext;

    handleIncrement() {
        const payload = {
            operator: 'add',
            constant: 1
        };
        publish(this.messageContext, COUNTING_UPDATED_CHANNEL, payload);
    }

    handleDecrement() {
        const payload = {
            operator: 'subtract',
            constant: 1
        };
        publish(this.messageContext, COUNTING_UPDATED_CHANNEL, payload);
    }

    handleMultiply() {
        const payload = {
            operator: 'multiply',
            constant: 2
        };
        publish(this.messageContext, COUNTING_UPDATED_CHANNEL, payload);
    }

    // Input field data publish
    @track value;

    HandleChange(event) {
        this.value = event.target.value;

        const payload = {
            operator: 'name',
            constant: this.value
        }
        publish(this.messageContext, COUNTING_UPDATED_CHANNEL, payload);
    }
}
