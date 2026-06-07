export const fixFields = [
      //Zeile 1

    {
          //Zeile 1
          'fields':
          [
              {
                  "label": "Vorname",
                  "field_id": "first_name",
                  "field_type": "text",
                  "size":"w-full",
                  "required": true
              },
              {
                  "label": "Nachname",
                  "field_id": "last_name",
                  "field_type": "text",
                  "size":"w-full",
                  "required": true
              }
          ]
      },
      // Zeile 2
      {
          'fields':
          [
              {
                  "label": "Wohnort",
                  "field_id":"city",
                  "field_type": "text",
                  "size":"w-3/4",
                  "required": true

              },
              {
                  "label":"PLZ",
                  "field_id": "zip",
                  "field_type": "text",
                  "size":"w-1/4",
                  "required": true
              }
          ]
      },
      //Zeile 3
      {
          'fields':
          [
              {
                  "label": "Geburtsdatum",
                  "field_id": "date_of_birth",
                  "field_type": "date",
                  "size":"w-1/2",
                  "required": true
              }
          ]
      },
      //Zeile4
      {
          'fields':
          [
              {
                  "label":"Telefonnummer",
                  "field_id" : "phone",
                  "field_type": "tel",
                  "size":"w-full",
                  "required": true
              },
              {
                  "label": "Nachname des Bürgen",
                  "field_id": "name_bondsman",
                  "field_type": "text",
                  "size":"w-full",
                  "required": false,

              }
          ]
      },
      // Zeile 5
      {
          'fields':
          [
              {
                  "label": "Email",
                  "field_id": "email",
                  "field_type": "email",
                  "required": true,
                  "size":"w-full",
                  "own_size":"",
              }
          ]
      }
  ]