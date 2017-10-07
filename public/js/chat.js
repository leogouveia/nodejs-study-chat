var socket = io()
if (!window.user)
    window.user = {}

moment.locale(navigator.language)

function scrollToBottom() {
    var messages = $('#messages')
    var newMessage = messages.children('article:last-child')

    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log('hi')
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function() {
    console.log("Connected on server")
    var params = $.deparam(window.location.search)
    socket.emit('join', params, function(_user, err) {
        if (err) {
            alert(err)
            window.location.href = '/'
        } 
        window.user = user
    })
})

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>')

    users.forEach(function(user) {

        var myLi = '<li></li>'
        if (user.id === window.user.id)
            myLi = '<li class="me"></li>'

        ol.append($(myLi).text(user.name))
    })

    $('#users').html(ol)
})

socket.on('newMessage', function(message) {
    // console.log('New message', message)
    var formattedTime = moment(message.createdAt).format('LT')

    console.log('local user', window.user)

    var typeBox = (message.from !== window.user.name) ? '' : 'is-info'
    typeBox = (message.from === 'Admin') ? 'is-warning' : typeBox

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
    var typeBox = (message.from !== window.user.name) ? '' : 'is-info'
    var article = $('<article class="message '+ typeBox + '"></article>')
    var header = $('<div class="message-header"><p>' + message.from + '</p></div>')
    var locationLink = $('<a target="_blank" href="' + message.url + '">Location</a>')
    var body = $('<div class="message-body"></div>')
    body.append(locationLink)
    article.append(header)
    article.append(body)

    $('#messages').append(article)
})

console.log("Oi!")
$('#message-form').on('submit', function(e) {
    e.preventDefault()
    // console.log("clicked")
    console.log('submit ')
    socket.emit('createMessage', {
        from: window.user.id, 
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

