class EndPoint {
    static baseUrl = "http://3.130.25.213:8000/api/";
    //static baseUrl = "http://localhost:8000/api/";
    static register = 'user/register';
    static login = 'user/login';
    static getSharedDoc = '/document/shared-docs';
    static shareDoc = '/document/share-doc';
    static myDocs = '/document/my-doc';
    static createDocument = '/document/create-document'
    static getDocument = '/document/get-document'
    static getFullUrl(endpoint) {
      return `${this.baseUrl}${endpoint}`;
    }
  }
  export default EndPoint;
  