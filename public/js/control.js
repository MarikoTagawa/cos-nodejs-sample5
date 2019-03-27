
//For Local
 AxiosOptions = {crossdomain: true };

//For IBM Cloud
//var AxiosOptions = {};

 new Vue({
   el: '#app',
   data: {
      search:"",
      headers:[],
      objectStrageSettings: {
        mybucket:'mt-test1',
         num: 1,
         myfile:'mt-text1',
         filecontent:'this is a mt-text1'},
      objectList: [],
      currentObjectListBucket: ""
   },
   created(){
     var that = this;
     this.getObjectList();
   },
   mounted(){
   },
   methods: {
     setSettings(){
       var that = this;
       var setting = this.objectStrageSettings;
      axios
      .post('/setting', setting)
      .then(function(resdata){
        console.log(resdata.data);
        that.getObjectList();
      },function(err){
          console.log(err);
        });
     },
     getObjectList(){
       var that = this;
       axios
       .get('/list', AxiosOptions)
       .then(function(resdata){
         console.log(resdata);
         if(resdata['data']['Contents']){
           that.objectList = resdata['data']['Contents'];
           that.currentObjectListBucket = resdata['data']['Name'];
         }else {
           that.objectList = [];
           that.currentObjectListBucket = "";
         }
       },function(err){
           console.log(err);
         });
     }
   }
 })
