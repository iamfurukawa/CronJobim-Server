import axios, { AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {describe, expect, it} from '@jest/globals'

import SenderMessage from '../src/Services/SenderMessage'

const mock = new MockAdapter(axios)

describe('send', () => {
    const message = {'message': 'some text'}
    const webhook = 'http://webhook.test.com'
    const senderMessage = new SenderMessage()

    it('sends successfully data to a Webhook', async () => {
        const axiosResponse: AxiosResponse = {
            data: {
            userId: 1,
            id: 1,
            title:
            "success",
            body:
            "success"
            },
            status: 200,
            statusText: "OK",
            config: {},
            headers: {}
        }

        mock.onPost(webhook).reply(axiosResponse.status, axiosResponse)
        const result = await senderMessage.send(message, webhook)
        expect(result).toBeTruthy()
    })
   
    it('error when send data to a Webhook', async () => {
        const axiosResponse: AxiosResponse = {
            data: {
            userId: 1,
            id: 1,
            title:
            "error",
            body:
            "error"
            },
            status: 404,
            statusText: "NOT_FOUND",
            config: {},
            headers: {}
        }

        mock.onPost(webhook).reply(axiosResponse.status, axiosResponse)
        const result = await senderMessage.send(message, webhook)
        expect(result).toBeFalsy()
    })
})