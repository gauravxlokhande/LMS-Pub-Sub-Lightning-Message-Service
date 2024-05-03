# Pub-Sub LWC : Lightning Message Service.

## Steps to use Pub-Sub:

## Step 1 : create a folder named "messageChannels" under the "force-app".
![image](https://github.com/gauravxlokhande/Pub-Sub_Lightning_Web_Components/assets/119065314/6cde8c4d-a218-44e1-8595-ceced5b7d549)

## Step 2 : create the file named "Counting_Update.messageChannel-meta.xml".  // "Counting_Update" is a name of xml file.
![image](https://github.com/gauravxlokhande/Pub-Sub_Lightning_Web_Components/assets/119065314/dde18ec3-f5a4-455b-80ca-bd70ed89ea81)

- inside the xml file declear the messagefield inside it fieldname for the field. Like below:

```
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>CountingUpdated</masterLabel>
    <isExposed>true</isExposed>
    <description>This Lightning Message Channel sends information from VF to LWC</description>

    <lightningMessageFields>
        <fieldName>operator</fieldName>
        <description>This is the operator field for manipulation</description>
    </lightningMessageFields>

    <lightningMessageFields>
        <fieldName>constant</fieldName>
        <description>This is the number for manipulation</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

## Step 3: Create a  publish component and import the publish and messagecontext , and the xml file that we create. like below:

```
import { publish, MessageContext } from "lightning/messageService";
import COUNTING_UPDATED_CHANNEL from '@salesforce/messageChannel/Counting_Update__c';   // xml file name import as __c
```

## Step 4: use it in js:

## publwc.html
```
<template>
    <lightning-card icon-name="standard:account" variant="base">
        <lightning-button class="slds-p-horizontal_small" variant="base" label="Add +1"
            onclick={handleIncrement}></lightning-button>
        <lightning-button class="slds-p-horizontal_small" variant="base" label="Subtract -1"
            onclick={handleDecrement}></lightning-button>
        <lightning-button class="slds-p-horizontal_small" variant="base" label="Multiply x2"
            onclick={handleMultiply}></lightning-button>

        <lightning-input type="text" label="Enter Name" value={value} onblur={HandleChange}></lightning-input>
    </lightning-card>
</template>
```

## publwc.js
```
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

```

## Step 5: accept data in sublwc component

## sublwc.html
```
<template>
    <lightning-card title="Sub LWC" variant="base">
        <p class="slds-text-align_center">
            count: <lightning-formatted-number value={counter}></lightning-formatted-number>
        </p>
        <p>Name: {name}</p>
    </lightning-card>
</template>
```

## sublwc.js
```
import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';                     // import sub and messagecontext
import COUNTING_UPDATED_CHANNEL from '@salesforce/messageChannel/Counting_Update__c';     // import message channel

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

```

 # ______________________________________________________________
