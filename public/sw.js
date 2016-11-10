self.addEventListener('push', function(event){
    console.log('Recieved a push message', event);

    var data = event.data.json();

    var title = data.title;
    var body = data.body;
    var icon = '';
    var tag = 'GraphlrPushTag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    )
});