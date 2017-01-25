﻿using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MyAthleticsClub.Api.Events
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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Employee");

                    // First add the headers
                    worksheet.Cells["A1"].Value = "Navn";
                    worksheet.Cells["B1"].Value = "Årgang";
                    worksheet.Cells["C1"].Value = "Klasse";
                    worksheet.Cells["D1"].Value = "Øvelse";
                    worksheet.Cells["E1"].Value = "Seedning Resultat";

                    // Add values
                    int rowIndex = 2;
                    registrations.ToList().ForEach(registration =>
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

                    //worksheet.Cells["A2"].Value = 1000;
                    //worksheet.Cells["B2"].Value = "Jon";
                    //worksheet.Cells["C2"].Value = "M";
                    //worksheet.Cells["D2"].Value = 5000;

                    //worksheet.Cells["A3"].Value = 1001;
                    //worksheet.Cells["B3"].Value = "Graham";
                    //worksheet.Cells["C3"].Value = "M";
                    //worksheet.Cells["D3"].Value = 10000;

                    //worksheet.Cells["A4"].Value = 1002;
                    //worksheet.Cells["B4"].Value = "Jenny";
                    //worksheet.Cells["C4"].Value = "F";
                    //worksheet.Cells["D4"].Value = 5000;

                    package.Save(); //Save the workbook.
                }

                bytes = stream.ToArray();
            }

            return bytes;
        }
    }
}