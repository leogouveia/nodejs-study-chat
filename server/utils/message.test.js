var expect = require('expect')

var {generateMessage} = require('./message')

describe('Message => generateMessage', () => {
    it('should generate correct message object', () => {
        let text = "Test message"

        let message = generateMessage(from, text)

        expect(typeof message.createdAt).toBe('number')
        expect(message).toHaveProperty('text', text)
    })
})