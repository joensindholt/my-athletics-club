echo 'Running tests'

if [ ! -d "./artifacts" ]; then
  mkdir ./artifacts
fi

~/.nuget/packages/opencover/4.6.519/tools/OpenCover.Console.exe \
  -target:"/c/Program Files/dotnet/dotnet.exe" \
  -targetargs:"test" \
  -register:user \
  -output:"./artifacts/results.xml" \
  -filter:"+[MyAthleticsClub*]* -[MyAthleticsClub.UnitTests*]*" \
  -hideskipped:Filter \
  -oldStyle

echo 'Building test report'

~/.nuget/packages/reportgenerator/2.5.8/tools/ReportGenerator.exe -reports:"./artifacts/results.xml" -targetdir:"./artifacts/coverage-report"

echo 'Report can be found at: ./artifacts/coverage-report'
