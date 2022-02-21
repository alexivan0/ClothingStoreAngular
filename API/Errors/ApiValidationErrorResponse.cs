using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{

    // ApiResponse sends back custom messages depending on the status code returned from the request
    public class ApiValidationErrorResponse : ApiResponse
    {
        
        //takes the custom message from the 400 error?
        public ApiValidationErrorResponse() : base(400)
        {
        }

        // contains a enumerable of the custom erros, displayed as strings
        public IEnumerable<string> Errors { get; set; }
    }
}