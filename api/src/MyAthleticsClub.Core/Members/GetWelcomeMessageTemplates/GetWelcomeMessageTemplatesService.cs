using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace MyAthleticsClub.Core.Members.GetWelcomeMessageTemplates
{
    public class GetWelcomeMessageTemplatesService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IMemoryCache _cache;
        private readonly GetWelcomeMessageTemplatesOptions _options;

        public GetWelcomeMessageTemplatesService(IAmazonS3 s3Client, IMemoryCache cache, IOptions<GetWelcomeMessageTemplatesOptions> options)
        {
            _s3Client = s3Client;
            _cache = cache;
            _options = options.Value;
        }

        public async Task<GetWelcomeMessageTemplatesResponse> GetWelcomeMessageTemplates()
        {
            var cacheKey = "GetWelcomeMessageTemplates";

            var response = _cache.Get<GetWelcomeMessageTemplatesResponse>(cacheKey);

            if (response == null)
            {
                response = await GetTemplatesFromS3();
                _cache.Set(cacheKey, response, new MemoryCacheEntryOptions { SlidingExpiration = TimeSpan.FromMinutes(10) });
            }

            return response;
        }

        private async Task<GetWelcomeMessageTemplatesResponse> GetTemplatesFromS3()
        {
            var response = new GetWelcomeMessageTemplatesResponse();

            var listObjectsResponse = await _s3Client.ListObjectsV2Async(new Amazon.S3.Model.ListObjectsV2Request
            {
                BucketName = _options.Bucket,
                Prefix = _options.KeyPrefix
            });

            foreach (var s3Object in listObjectsResponse.S3Objects)
            {
                if (s3Object.Key == _options.KeyPrefix)
                {
                    continue;
                }

                var getObjectResponse = await _s3Client.GetObjectAsync(s3Object.BucketName, s3Object.Key);
                using (var streamReader = new StreamReader(getObjectResponse.ResponseStream))
                {
                    var contents = streamReader.ReadToEnd();
                    var team = s3Object.Key.Split('/').Last().Split('.').First();
                    response.Templates[team] = contents;
                }
            }

            return response;
        }
    }
}
