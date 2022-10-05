using System;
using System.Text;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Collections.Generic;
using Newtonsoft.Json;
using admin.Models;
using System.Net.Http.Headers;
using RestSharp;

namespace admin.Services
{
    public class UtilServices
    {
        public static string CalculateMD5Hash(string input)
        {
            // Calcular o Hash
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // Converter byte array para string hexadecimal
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }

            return sb.ToString();
        }

        public static object RequestApiKim(string method = "get", String userId = "", String token = "", String url = "", string endpoint = "", string param = "", object data = null)
        {
                    dynamic jsonObj = null;
                    var client = new HttpClient();
                    client.DefaultRequestHeaders.Add("User", userId);
                    client.DefaultRequestHeaders.Add("Authorization", token);

                    if(method == "get")
                    {
                        HttpResponseMessage response = client.GetAsync(url + endpoint + param).Result;
                        var contents = response.Content.ReadAsStringAsync().Result;
                        var json = JObject.Parse(contents);
                        jsonObj = json.ToObject<dynamic>();
                    } 
                    else if(method == "post") 
                    {
                        var dataJson = JsonConvert.SerializeObject(data, Formatting.Indented);
                        var stringContent = new StringContent(dataJson, Encoding.UTF8, "application/json");
                        HttpResponseMessage response = client.PostAsync(url + endpoint + param, stringContent).Result;
                        var contents = response.Content.ReadAsStringAsync().Result;
                        var json = JObject.Parse(contents);
                        jsonObj = json.ToObject<dynamic>();
                    }

            return jsonObj;
        }



        public static object RequestCitSoaAuthenticate(string method = "", string url = "", string endpoint = "", string param = "", object data = null, string token="")
        {


            dynamic json = null;

            if (method == "get")
            {
                var client = new RestClient(url + endpoint + param);
                client.Timeout = -1;
                var request = new RestRequest(Method.GET);
                request.AddHeader("Authorization", token);
                request.AddHeader("Content-Type", "application/json; charset=utf-8");
                IRestResponse response = client.Execute(request);
                json = JsonConvert.DeserializeObject<dynamic>(response.Content);
            }

            return json;
            //      else if (method == "post")
            //      {
            //          var dataJson = JsonConvert.SerializeObject(data, Formatting.Indented);
            //          var stringContent = new StringContent(dataJson, Encoding.UTF8, "application/json");
            //          HttpResponseMessage response = client.PostAsync(url + endpoint + param, stringContent).Result;
            //          var contents = response.Content.ReadAsStringAsync().Result;
            //          var json = JObject.Parse(contents);
            //          jsonObj = json.ToObject<dynamic>();
            //      }

            // return jsonObj;
        }


        public static object RequestCitSoa(string method = "get", string url = "",string token = "", string endpoint = "", string param = "", object data = null)
        {
            dynamic jsonObj = null;
            var client = new HttpClient();


            if (method == "get")
            {
                HttpResponseMessage response = client.GetAsync(url + endpoint + param).Result;
                var contents = response.Content.ReadAsStringAsync().Result;
                var json = JObject.Parse(contents);
                jsonObj = json.ToObject<dynamic>();
            }
            else if (method == "post")
            {
                client.DefaultRequestHeaders.Add("Authorization", token);

                var dataJson = JsonConvert.SerializeObject(data, Formatting.Indented);
                var stringContent = new StringContent(dataJson, Encoding.UTF8, "application/json");
                HttpResponseMessage response = client.PostAsync(url + endpoint + param, stringContent).Result;
                var contents = response.Content.ReadAsStringAsync().Result;
                var json = JObject.Parse(contents);
                jsonObj = json.ToObject<dynamic>();
            }

            return jsonObj;
        }





    }
}