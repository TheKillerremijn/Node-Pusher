#Websocket handler#
##Creating a namespace##

**POST** /\<namespace\>/create

Post data:

apiKey=\<the api key you want to use\>

Returns:

200 `{"namespace": \<namespace\>}`

OR

400 `{ "message": 'Malformed request: no apiKey sent with the request' }`

OR

400 `{ "message": 'Malformed request: namespace already exists' }`



##Deleting a namespace##

**POST** /\<namespace\>/delete

Post data:

apiKey=\<the api key you want to use\>

Returns:

200 `{"namespace": \<namespace\>}`

OR

400 `{ "message": 'Malformed request: no apiKey sent with the request' }`

OR

400 `{ "message": 'Malformed request: namespace does not exists' }`

OR

401 `{ "message": 'Malformed request: apiKey does not match the one on the namespace' }`

##Send data to a namespace##

**POST** /\<namespace\>/

Post data:

apiKey=\<the api key you want to use\>
data=\<the data you want to send out\>

Returns:

200 `{"namespace": \<namespace\>}`

OR

400 `{ "message": 'Malformed request: namespace does not exists' }`

OR

400 `{ "message": 'Malformed request: no apiKey sent with the request' }`

OR

401 `{ "message": 'Malformed request: apiKey does not match the one on the namespace' }`

OR

400 `{ "message": 'Malformed request, use 'data' post element' }`

**GET** /\<namespace\>/

Query data:

apiKey=\<the api key you want to use\>

data or message=\<the data you want to send out\>

Returns:

200 `{"namespace": \<namespace\>}`

OR

400 `{ "message": 'Malformed request: namespace does not exists' }`

OR

400 `{ "message": 'Malformed request: no apiKey sent with the request' }`

OR

401 `{ "message": 'Malformed request: apiKey does not match the one on the namespace' }`

OR

400 `{ "message": 'Malformed request, use \'data\' or \'message\' get query' }`

##Get namespace Users##

**GET** /\<namespace\>/users

Post data:

apiKey=\<the api key you want to use\>
data=\<the data you want to send out\>

Returns:

200 `[{"ip": "127.0.0.1" "id": "AAAAAAAAAAAAAA"}]`

OR

400 `{ "message": 'Malformed request: namespace does not exists' }`

OR

400 `{ "message": 'Malformed request: no apiKey sent with the request' }`

OR

401 `{ "message": 'Malformed request: apiKey does not match the one on the namespace' }`