using System.Collections.Generic;
using System.IO;
using System.Linq;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using OfficeOpenXml;

namespace MyAthleticsClub.Core.Services
{
    public class EventRegistrationsExcelService : IEventRegistrationsExcelService
    {
        public EventRegistrationsExcelService()
        {
        }

        public byte[] GetEventRegistrationsAsXlsx(IEnumerable<Registration> registrations)
        {
            byte[] bytes;
            using (var stream = new MemoryStream())
            {
                using (var package = new ExcelPackage(stream))
                {
                    // Add a new worksheet to the empty workbook
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Deltagere");

                    // First add the headers
                    worksheet.Cells["A1"].Value = "Navn";
                    worksheet.Cells["B1"].Value = "Årgang";
                    worksheet.Cells["C1"].Value = "Klasse";
                    worksheet.Cells["D1"].Value = "Øvelse";
                    worksheet.Cells["E1"].Value = "Seedning Resultat";

                    // Add values
                    int rowIndex = 2;
                    registrations.OrderBy(r => r.Timestamp).ToList().ForEach(registration =>
                    {
                        var name = registration.Name;
                        var year = registration.BirthYear;

                        var allDisciplines = registration.Disciplines.Concat(registration.ExtraDisciplines);

                        string lastDisciplineAgeClass = null;

                        allDisciplines.ToList().ForEach(discipline =>
                        {
                            // Dont write out class name when it's the same as the previous within the current registration
                            var ageClass = discipline is RegistrationExtraDiscipline ? ((RegistrationExtraDiscipline)discipline).AgeClass : registration.AgeClass;
                            if (ageClass == lastDisciplineAgeClass)
                            {
                                ageClass = "";
                            }

                            // Show discipline name when id is -1 indicating "custom" discipline
                            string disciplineOutput = discipline.Id == "-1" ? discipline.Name : discipline.Id;

                            // Output cell values
                            worksheet.Cells["A" + rowIndex].Value = name;
                            worksheet.Cells["B" + rowIndex].Value = year;
                            worksheet.Cells["C" + rowIndex].Value = ageClass;
                            worksheet.Cells["D" + rowIndex].Value = disciplineOutput;
                            worksheet.Cells["E" + rowIndex].Value = discipline.PersonalRecord;

                            // Prepare values for next iteration
                            name = "";
                            year = "";
                            lastDisciplineAgeClass = ageClass;
                            rowIndex++;
                        });
                    });

                    package.Save(); //Save the workbook.
                }

                bytes = stream.ToArray();
            }

            return bytes;
        }
    }
}
