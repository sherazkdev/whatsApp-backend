class ApiResponse {
    constructor(data = [],message = null ,success = true,statusCode = 200){
        this.data = data;
        this.message = message;
        this.success = success;
        this.statusCode = statusCode;
    }
}

export default ApiResponse;