# API_list
> 전체 API list입니다.

## API
method : `POST`
uri : `/api/register`  
Request Body
```json
{
    // username: string,
    // password: string,
    // email: string,
}
```

---
method : `POST`  
uri : `/api/login`  
Request Body
```json
{
    // username: string,
    // password: string,
    // baseurl: string,
}
```

---
method : `POST`  
uri : `/api/verify`  
Request Body
```json
{
    // token : string,
}
```

---
method : `POST`
uri : `/api/logout`
Request Body
```json
{
    // refresh_token: string,
}
```

---
method : `POST`
uri : `/api/refresh`
Request Body
```json
{
    // refresh_token: string,
}
```

---
method : `POST`
uri : `/api/me`
Request Body
```json
{
    // username: string,
}
```