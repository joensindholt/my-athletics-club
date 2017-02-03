using System.IO;
using Xunit;

namespace MyAthleticsClub.Api.UnitTests
{
    public class NamespaceTests
    {
        private string _baseNamespace;
        private string _basePath;

        public NamespaceTests()
        {
            _basePath = Path.GetDirectoryName("../../src/MyAthleticsClub.Api");
            _baseNamespace = "MyAthleticsClub.Api";
        }

        [Fact]
        public void NamespacesByFolder()
        {
            Assert.True(false);
        }
    }
}