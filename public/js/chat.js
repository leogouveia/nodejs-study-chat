var socket = io()
moment.locale(navigator.language)

function scrollToBottom() {
    var messages = $('#messages')
    var newMessage = messages.children('article:last-child')

    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()


    // console.log('clientHeight', clientHeight)
    // console.log('scrollTop', scrollTop)
    // console.log('scrollHeight', scrollHeight)
    // console.log('newMessageHeight', newMessageHeight)
    // console.log('lastMessageHeight', lastMessageHeight)
    // console.log('clientHeight + scrollTop + newMessageHeight + lastMessageHeight', clientHeight + scrollTop + newMessageHeight + lastMessageHeight)


    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log('hi')
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function() {
    var params = $.deparam(window.location.search)
    console.log(params)
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err)
            window.location.href = '/'
        } else {
            console.log('no error')
        }
    })

})

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

socket.on('newMessage', function(message) {
    // console.log('New message', message)
    var formattedTime = moment(message.createdAt).format('LT')

    var typeBox = (message.from === 'Admin') ? '' : 'is-info'
    var article = $('<article class="message '+ typeBox + '"></article>')
    var header = $('<div class="message-header"><p>' + message.from + ' (' + formattedTime +')</p></div>')
    var body = $('<div class="message-body">' + message.text + '</div>')
    article.append(header)
    article.append(body)

    $('#messages').append(article)
    scrollToBottom()

})

socket.on('newLocationMessage', function(message) {
    console.log('New Location message', message)
    var typeBox = (message.from === 'Admin') ? '' : 'is-info'
    var article = $('<article class="message '+ typeBox + '"></article>')
    var header = $('<div class="message-header"><p>' + message.from + '</p></div>')
    var locationLink = $('<a target="_blank" href="' + message.url + '">Location</a>')
    var body = $('<div class="message-body"></div>')
    body.append(locationLink)
    article.append(header)
    article.append(body)

    $('#messages').append(article)
})

$('#message-form').on('submit', function(e) {
    e.preventDefault()
    // console.log("clicked")
    socket.emit('createMessage', {
        from: 'User', 
        text: $('input[name=message]').val()
    }, function (data) {
        // console.log(data)
    })
})

$('#send-location').on('click', function(e) {
    if (!navigator.geolocation)
        return alert('Geolocation not supported by your browser')
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('Unable to fetch location')
    })
})

