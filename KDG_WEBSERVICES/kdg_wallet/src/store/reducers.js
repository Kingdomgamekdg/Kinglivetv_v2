const initialState = {contries : [
    {
        "flag": "https://restcountries.eu/data/afg.svg",
        "name": "Afghanistan",
        "alpha2Code": "AF"
    },
    {
        "flag": "https://restcountries.eu/data/ala.svg",
        "name": "Åland Islands",
        "alpha2Code": "AX"
    },
    {
        "flag": "https://restcountries.eu/data/alb.svg",
        "name": "Albania",
        "alpha2Code": "AL"
    },
    {
        "flag": "https://restcountries.eu/data/dza.svg",
        "name": "Algeria",
        "alpha2Code": "DZ"
    },
    {
        "flag": "https://restcountries.eu/data/asm.svg",
        "name": "American Samoa",
        "alpha2Code": "AS"
    },
    {
        "flag": "https://restcountries.eu/data/and.svg",
        "name": "Andorra",
        "alpha2Code": "AD"
    },
    {
        "flag": "https://restcountries.eu/data/ago.svg",
        "name": "Angola",
        "alpha2Code": "AO"
    },
    {
        "flag": "https://restcountries.eu/data/aia.svg",
        "name": "Anguilla",
        "alpha2Code": "AI"
    },
    {
        "flag": "https://restcountries.eu/data/ata.svg",
        "name": "Antarctica",
        "alpha2Code": "AQ"
    },
    {
        "flag": "https://restcountries.eu/data/atg.svg",
        "name": "Antigua and Barbuda",
        "alpha2Code": "AG"
    },
    {
        "flag": "https://restcountries.eu/data/arg.svg",
        "name": "Argentina",
        "alpha2Code": "AR"
    },
    {
        "flag": "https://restcountries.eu/data/arm.svg",
        "name": "Armenia",
        "alpha2Code": "AM"
    },
    {
        "flag": "https://restcountries.eu/data/abw.svg",
        "name": "Aruba",
        "alpha2Code": "AW"
    },
    {
        "flag": "https://restcountries.eu/data/aus.svg",
        "name": "Australia",
        "alpha2Code": "AU"
    },
    {
        "flag": "https://restcountries.eu/data/aut.svg",
        "name": "Austria",
        "alpha2Code": "AT"
    },
    {
        "flag": "https://restcountries.eu/data/aze.svg",
        "name": "Azerbaijan",
        "alpha2Code": "AZ"
    },
    {
        "flag": "https://restcountries.eu/data/bhs.svg",
        "name": "Bahamas",
        "alpha2Code": "BS"
    },
    {
        "flag": "https://restcountries.eu/data/bhr.svg",
        "name": "Bahrain",
        "alpha2Code": "BH"
    },
    {
        "flag": "https://restcountries.eu/data/bgd.svg",
        "name": "Bangladesh",
        "alpha2Code": "BD"
    },
    {
        "flag": "https://restcountries.eu/data/brb.svg",
        "name": "Barbados",
        "alpha2Code": "BB"
    },
    {
        "flag": "https://restcountries.eu/data/blr.svg",
        "name": "Belarus",
        "alpha2Code": "BY"
    },
    {
        "flag": "https://restcountries.eu/data/bel.svg",
        "name": "Belgium",
        "alpha2Code": "BE"
    },
    {
        "flag": "https://restcountries.eu/data/blz.svg",
        "name": "Belize",
        "alpha2Code": "BZ"
    },
    {
        "flag": "https://restcountries.eu/data/ben.svg",
        "name": "Benin",
        "alpha2Code": "BJ"
    },
    {
        "flag": "https://restcountries.eu/data/bmu.svg",
        "name": "Bermuda",
        "alpha2Code": "BM"
    },
    {
        "flag": "https://restcountries.eu/data/btn.svg",
        "name": "Bhutan",
        "alpha2Code": "BT"
    },
    {
        "flag": "https://restcountries.eu/data/bol.svg",
        "name": "Bolivia (Plurinational State of)",
        "alpha2Code": "BO"
    },
    {
        "flag": "https://restcountries.eu/data/bes.svg",
        "name": "Bonaire, Sint Eustatius and Saba",
        "alpha2Code": "BQ"
    },
    {
        "flag": "https://restcountries.eu/data/bih.svg",
        "name": "Bosnia and Herzegovina",
        "alpha2Code": "BA"
    },
    {
        "flag": "https://restcountries.eu/data/bwa.svg",
        "name": "Botswana",
        "alpha2Code": "BW"
    },
    {
        "flag": "https://restcountries.eu/data/bvt.svg",
        "name": "Bouvet Island",
        "alpha2Code": "BV"
    },
    {
        "flag": "https://restcountries.eu/data/bra.svg",
        "name": "Brazil",
        "alpha2Code": "BR"
    },
    {
        "flag": "https://restcountries.eu/data/iot.svg",
        "name": "British Indian Ocean Territory",
        "alpha2Code": "IO"
    },
    {
        "flag": "https://restcountries.eu/data/umi.svg",
        "name": "United States Minor Outlying Islands",
        "alpha2Code": "UM"
    },
    {
        "flag": "https://restcountries.eu/data/vgb.svg",
        "name": "Virgin Islands (British)",
        "alpha2Code": "VG"
    },
    {
        "flag": "https://restcountries.eu/data/vir.svg",
        "name": "Virgin Islands (U.S.)",
        "alpha2Code": "VI"
    },
    {
        "flag": "https://restcountries.eu/data/brn.svg",
        "name": "Brunei Darussalam",
        "alpha2Code": "BN"
    },
    {
        "flag": "https://restcountries.eu/data/bgr.svg",
        "name": "Bulgaria",
        "alpha2Code": "BG"
    },
    {
        "flag": "https://restcountries.eu/data/bfa.svg",
        "name": "Burkina Faso",
        "alpha2Code": "BF"
    },
    {
        "flag": "https://restcountries.eu/data/bdi.svg",
        "name": "Burundi",
        "alpha2Code": "BI"
    },
    {
        "flag": "https://restcountries.eu/data/khm.svg",
        "name": "Cambodia",
        "alpha2Code": "KH"
    },
    {
        "flag": "https://restcountries.eu/data/cmr.svg",
        "name": "Cameroon",
        "alpha2Code": "CM"
    },
    {
        "flag": "https://restcountries.eu/data/can.svg",
        "name": "Canada",
        "alpha2Code": "CA"
    },
    {
        "flag": "https://restcountries.eu/data/cpv.svg",
        "name": "Cabo Verde",
        "alpha2Code": "CV"
    },
    {
        "flag": "https://restcountries.eu/data/cym.svg",
        "name": "Cayman Islands",
        "alpha2Code": "KY"
    },
    {
        "flag": "https://restcountries.eu/data/caf.svg",
        "name": "Central African Republic",
        "alpha2Code": "CF"
    },
    {
        "flag": "https://restcountries.eu/data/tcd.svg",
        "name": "Chad",
        "alpha2Code": "TD"
    },
    {
        "flag": "https://restcountries.eu/data/chl.svg",
        "name": "Chile",
        "alpha2Code": "CL"
    },
    {
        "flag": "https://restcountries.eu/data/chn.svg",
        "name": "China",
        "alpha2Code": "CN"
    },
    {
        "flag": "https://restcountries.eu/data/cxr.svg",
        "name": "Christmas Island",
        "alpha2Code": "CX"
    },
    {
        "flag": "https://restcountries.eu/data/cck.svg",
        "name": "Cocos (Keeling) Islands",
        "alpha2Code": "CC"
    },
    {
        "flag": "https://restcountries.eu/data/col.svg",
        "name": "Colombia",
        "alpha2Code": "CO"
    },
    {
        "flag": "https://restcountries.eu/data/com.svg",
        "name": "Comoros",
        "alpha2Code": "KM"
    },
    {
        "flag": "https://restcountries.eu/data/cog.svg",
        "name": "Congo",
        "alpha2Code": "CG"
    },
    {
        "flag": "https://restcountries.eu/data/cod.svg",
        "name": "Congo (Democratic Republic of the)",
        "alpha2Code": "CD"
    },
    {
        "flag": "https://restcountries.eu/data/cok.svg",
        "name": "Cook Islands",
        "alpha2Code": "CK"
    },
    {
        "flag": "https://restcountries.eu/data/cri.svg",
        "name": "Costa Rica",
        "alpha2Code": "CR"
    },
    {
        "flag": "https://restcountries.eu/data/hrv.svg",
        "name": "Croatia",
        "alpha2Code": "HR"
    },
    {
        "flag": "https://restcountries.eu/data/cub.svg",
        "name": "Cuba",
        "alpha2Code": "CU"
    },
    {
        "flag": "https://restcountries.eu/data/cuw.svg",
        "name": "Curaçao",
        "alpha2Code": "CW"
    },
    {
        "flag": "https://restcountries.eu/data/cyp.svg",
        "name": "Cyprus",
        "alpha2Code": "CY"
    },
    {
        "flag": "https://restcountries.eu/data/cze.svg",
        "name": "Czech Republic",
        "alpha2Code": "CZ"
    },
    {
        "flag": "https://restcountries.eu/data/dnk.svg",
        "name": "Denmark",
        "alpha2Code": "DK"
    },
    {
        "flag": "https://restcountries.eu/data/dji.svg",
        "name": "Djibouti",
        "alpha2Code": "DJ"
    },
    {
        "flag": "https://restcountries.eu/data/dma.svg",
        "name": "Dominica",
        "alpha2Code": "DM"
    },
    {
        "flag": "https://restcountries.eu/data/dom.svg",
        "name": "Dominican Republic",
        "alpha2Code": "DO"
    },
    {
        "flag": "https://restcountries.eu/data/ecu.svg",
        "name": "Ecuador",
        "alpha2Code": "EC"
    },
    {
        "flag": "https://restcountries.eu/data/egy.svg",
        "name": "Egypt",
        "alpha2Code": "EG"
    },
    {
        "flag": "https://restcountries.eu/data/slv.svg",
        "name": "El Salvador",
        "alpha2Code": "SV"
    },
    {
        "flag": "https://restcountries.eu/data/gnq.svg",
        "name": "Equatorial Guinea",
        "alpha2Code": "GQ"
    },
    {
        "flag": "https://restcountries.eu/data/eri.svg",
        "name": "Eritrea",
        "alpha2Code": "ER"
    },
    {
        "flag": "https://restcountries.eu/data/est.svg",
        "name": "Estonia",
        "alpha2Code": "EE"
    },
    {
        "flag": "https://restcountries.eu/data/eth.svg",
        "name": "Ethiopia",
        "alpha2Code": "ET"
    },
    {
        "flag": "https://restcountries.eu/data/flk.svg",
        "name": "Falkland Islands (Malvinas)",
        "alpha2Code": "FK"
    },
    {
        "flag": "https://restcountries.eu/data/fro.svg",
        "name": "Faroe Islands",
        "alpha2Code": "FO"
    },
    {
        "flag": "https://restcountries.eu/data/fji.svg",
        "name": "Fiji",
        "alpha2Code": "FJ"
    },
    {
        "flag": "https://restcountries.eu/data/fin.svg",
        "name": "Finland",
        "alpha2Code": "FI"
    },
    {
        "flag": "https://restcountries.eu/data/fra.svg",
        "name": "France",
        "alpha2Code": "FR"
    },
    {
        "flag": "https://restcountries.eu/data/guf.svg",
        "name": "French Guiana",
        "alpha2Code": "GF"
    },
    {
        "flag": "https://restcountries.eu/data/pyf.svg",
        "name": "French Polynesia",
        "alpha2Code": "PF"
    },
    {
        "flag": "https://restcountries.eu/data/atf.svg",
        "name": "French Southern Territories",
        "alpha2Code": "TF"
    },
    {
        "flag": "https://restcountries.eu/data/gab.svg",
        "name": "Gabon",
        "alpha2Code": "GA"
    },
    {
        "flag": "https://restcountries.eu/data/gmb.svg",
        "name": "Gambia",
        "alpha2Code": "GM"
    },
    {
        "flag": "https://restcountries.eu/data/geo.svg",
        "name": "Georgia",
        "alpha2Code": "GE"
    },
    {
        "flag": "https://restcountries.eu/data/deu.svg",
        "name": "Germany",
        "alpha2Code": "DE"
    },
    {
        "flag": "https://restcountries.eu/data/gha.svg",
        "name": "Ghana",
        "alpha2Code": "GH"
    },
    {
        "flag": "https://restcountries.eu/data/gib.svg",
        "name": "Gibraltar",
        "alpha2Code": "GI"
    },
    {
        "flag": "https://restcountries.eu/data/grc.svg",
        "name": "Greece",
        "alpha2Code": "GR"
    },
    {
        "flag": "https://restcountries.eu/data/grl.svg",
        "name": "Greenland",
        "alpha2Code": "GL"
    },
    {
        "flag": "https://restcountries.eu/data/grd.svg",
        "name": "Grenada",
        "alpha2Code": "GD"
    },
    {
        "flag": "https://restcountries.eu/data/glp.svg",
        "name": "Guadeloupe",
        "alpha2Code": "GP"
    },
    {
        "flag": "https://restcountries.eu/data/gum.svg",
        "name": "Guam",
        "alpha2Code": "GU"
    },
    {
        "flag": "https://restcountries.eu/data/gtm.svg",
        "name": "Guatemala",
        "alpha2Code": "GT"
    },
    {
        "flag": "https://restcountries.eu/data/ggy.svg",
        "name": "Guernsey",
        "alpha2Code": "GG"
    },
    {
        "flag": "https://restcountries.eu/data/gin.svg",
        "name": "Guinea",
        "alpha2Code": "GN"
    },
    {
        "flag": "https://restcountries.eu/data/gnb.svg",
        "name": "Guinea-Bissau",
        "alpha2Code": "GW"
    },
    {
        "flag": "https://restcountries.eu/data/guy.svg",
        "name": "Guyana",
        "alpha2Code": "GY"
    },
    {
        "flag": "https://restcountries.eu/data/hti.svg",
        "name": "Haiti",
        "alpha2Code": "HT"
    },
    {
        "flag": "https://restcountries.eu/data/hmd.svg",
        "name": "Heard Island and McDonald Islands",
        "alpha2Code": "HM"
    },
    {
        "flag": "https://restcountries.eu/data/vat.svg",
        "name": "Holy See",
        "alpha2Code": "VA"
    },
    {
        "flag": "https://restcountries.eu/data/hnd.svg",
        "name": "Honduras",
        "alpha2Code": "HN"
    },
    {
        "flag": "https://restcountries.eu/data/hkg.svg",
        "name": "Hong Kong",
        "alpha2Code": "HK"
    },
    {
        "flag": "https://restcountries.eu/data/hun.svg",
        "name": "Hungary",
        "alpha2Code": "HU"
    },
    {
        "flag": "https://restcountries.eu/data/isl.svg",
        "name": "Iceland",
        "alpha2Code": "IS"
    },
    {
        "flag": "https://restcountries.eu/data/ind.svg",
        "name": "India",
        "alpha2Code": "IN"
    },
    {
        "flag": "https://restcountries.eu/data/idn.svg",
        "name": "Indonesia",
        "alpha2Code": "ID"
    },
    {
        "flag": "https://restcountries.eu/data/civ.svg",
        "name": "Côte d'Ivoire",
        "alpha2Code": "CI"
    },
    {
        "flag": "https://restcountries.eu/data/irn.svg",
        "name": "Iran (Islamic Republic of)",
        "alpha2Code": "IR"
    },
    {
        "flag": "https://restcountries.eu/data/irq.svg",
        "name": "Iraq",
        "alpha2Code": "IQ"
    },
    {
        "flag": "https://restcountries.eu/data/irl.svg",
        "name": "Ireland",
        "alpha2Code": "IE"
    },
    {
        "flag": "https://restcountries.eu/data/imn.svg",
        "name": "Isle of Man",
        "alpha2Code": "IM"
    },
    {
        "flag": "https://restcountries.eu/data/isr.svg",
        "name": "Israel",
        "alpha2Code": "IL"
    },
    {
        "flag": "https://restcountries.eu/data/ita.svg",
        "name": "Italy",
        "alpha2Code": "IT"
    },
    {
        "flag": "https://restcountries.eu/data/jam.svg",
        "name": "Jamaica",
        "alpha2Code": "JM"
    },
    {
        "flag": "https://restcountries.eu/data/jpn.svg",
        "name": "Japan",
        "alpha2Code": "JP"
    },
    {
        "flag": "https://restcountries.eu/data/jey.svg",
        "name": "Jersey",
        "alpha2Code": "JE"
    },
    {
        "flag": "https://restcountries.eu/data/jor.svg",
        "name": "Jordan",
        "alpha2Code": "JO"
    },
    {
        "flag": "https://restcountries.eu/data/kaz.svg",
        "name": "Kazakhstan",
        "alpha2Code": "KZ"
    },
    {
        "flag": "https://restcountries.eu/data/ken.svg",
        "name": "Kenya",
        "alpha2Code": "KE"
    },
    {
        "flag": "https://restcountries.eu/data/kir.svg",
        "name": "Kiribati",
        "alpha2Code": "KI"
    },
    {
        "flag": "https://restcountries.eu/data/kwt.svg",
        "name": "Kuwait",
        "alpha2Code": "KW"
    },
    {
        "flag": "https://restcountries.eu/data/kgz.svg",
        "name": "Kyrgyzstan",
        "alpha2Code": "KG"
    },
    {
        "flag": "https://restcountries.eu/data/lao.svg",
        "name": "Lao People's Democratic Republic",
        "alpha2Code": "LA"
    },
    {
        "flag": "https://restcountries.eu/data/lva.svg",
        "name": "Latvia",
        "alpha2Code": "LV"
    },
    {
        "flag": "https://restcountries.eu/data/lbn.svg",
        "name": "Lebanon",
        "alpha2Code": "LB"
    },
    {
        "flag": "https://restcountries.eu/data/lso.svg",
        "name": "Lesotho",
        "alpha2Code": "LS"
    },
    {
        "flag": "https://restcountries.eu/data/lbr.svg",
        "name": "Liberia",
        "alpha2Code": "LR"
    },
    {
        "flag": "https://restcountries.eu/data/lby.svg",
        "name": "Libya",
        "alpha2Code": "LY"
    },
    {
        "flag": "https://restcountries.eu/data/lie.svg",
        "name": "Liechtenstein",
        "alpha2Code": "LI"
    },
    {
        "flag": "https://restcountries.eu/data/ltu.svg",
        "name": "Lithuania",
        "alpha2Code": "LT"
    },
    {
        "flag": "https://restcountries.eu/data/lux.svg",
        "name": "Luxembourg",
        "alpha2Code": "LU"
    },
    {
        "flag": "https://restcountries.eu/data/mac.svg",
        "name": "Macao",
        "alpha2Code": "MO"
    },
    {
        "flag": "https://restcountries.eu/data/mkd.svg",
        "name": "Macedonia (the former Yugoslav Republic of)",
        "alpha2Code": "MK"
    },
    {
        "flag": "https://restcountries.eu/data/mdg.svg",
        "name": "Madagascar",
        "alpha2Code": "MG"
    },
    {
        "flag": "https://restcountries.eu/data/mwi.svg",
        "name": "Malawi",
        "alpha2Code": "MW"
    },
    {
        "flag": "https://restcountries.eu/data/mys.svg",
        "name": "Malaysia",
        "alpha2Code": "MY"
    },
    {
        "flag": "https://restcountries.eu/data/mdv.svg",
        "name": "Maldives",
        "alpha2Code": "MV"
    },
    {
        "flag": "https://restcountries.eu/data/mli.svg",
        "name": "Mali",
        "alpha2Code": "ML"
    },
    {
        "flag": "https://restcountries.eu/data/mlt.svg",
        "name": "Malta",
        "alpha2Code": "MT"
    },
    {
        "flag": "https://restcountries.eu/data/mhl.svg",
        "name": "Marshall Islands",
        "alpha2Code": "MH"
    },
    {
        "flag": "https://restcountries.eu/data/mtq.svg",
        "name": "Martinique",
        "alpha2Code": "MQ"
    },
    {
        "flag": "https://restcountries.eu/data/mrt.svg",
        "name": "Mauritania",
        "alpha2Code": "MR"
    },
    {
        "flag": "https://restcountries.eu/data/mus.svg",
        "name": "Mauritius",
        "alpha2Code": "MU"
    },
    {
        "flag": "https://restcountries.eu/data/myt.svg",
        "name": "Mayotte",
        "alpha2Code": "YT"
    },
    {
        "flag": "https://restcountries.eu/data/mex.svg",
        "name": "Mexico",
        "alpha2Code": "MX"
    },
    {
        "flag": "https://restcountries.eu/data/fsm.svg",
        "name": "Micronesia (Federated States of)",
        "alpha2Code": "FM"
    },
    {
        "flag": "https://restcountries.eu/data/mda.svg",
        "name": "Moldova (Republic of)",
        "alpha2Code": "MD"
    },
    {
        "flag": "https://restcountries.eu/data/mco.svg",
        "name": "Monaco",
        "alpha2Code": "MC"
    },
    {
        "flag": "https://restcountries.eu/data/mng.svg",
        "name": "Mongolia",
        "alpha2Code": "MN"
    },
    {
        "flag": "https://restcountries.eu/data/mne.svg",
        "name": "Montenegro",
        "alpha2Code": "ME"
    },
    {
        "flag": "https://restcountries.eu/data/msr.svg",
        "name": "Montserrat",
        "alpha2Code": "MS"
    },
    {
        "flag": "https://restcountries.eu/data/mar.svg",
        "name": "Morocco",
        "alpha2Code": "MA"
    },
    {
        "flag": "https://restcountries.eu/data/moz.svg",
        "name": "Mozambique",
        "alpha2Code": "MZ"
    },
    {
        "flag": "https://restcountries.eu/data/mmr.svg",
        "name": "Myanmar",
        "alpha2Code": "MM"
    },
    {
        "flag": "https://restcountries.eu/data/nam.svg",
        "name": "Namibia",
        "alpha2Code": "NA"
    },
    {
        "flag": "https://restcountries.eu/data/nru.svg",
        "name": "Nauru",
        "alpha2Code": "NR"
    },
    {
        "flag": "https://restcountries.eu/data/npl.svg",
        "name": "Nepal",
        "alpha2Code": "NP"
    },
    {
        "flag": "https://restcountries.eu/data/nld.svg",
        "name": "Netherlands",
        "alpha2Code": "NL"
    },
    {
        "flag": "https://restcountries.eu/data/ncl.svg",
        "name": "New Caledonia",
        "alpha2Code": "NC"
    },
    {
        "flag": "https://restcountries.eu/data/nzl.svg",
        "name": "New Zealand",
        "alpha2Code": "NZ"
    },
    {
        "flag": "https://restcountries.eu/data/nic.svg",
        "name": "Nicaragua",
        "alpha2Code": "NI"
    },
    {
        "flag": "https://restcountries.eu/data/ner.svg",
        "name": "Niger",
        "alpha2Code": "NE"
    },
    {
        "flag": "https://restcountries.eu/data/nga.svg",
        "name": "Nigeria",
        "alpha2Code": "NG"
    },
    {
        "flag": "https://restcountries.eu/data/niu.svg",
        "name": "Niue",
        "alpha2Code": "NU"
    },
    {
        "flag": "https://restcountries.eu/data/nfk.svg",
        "name": "Norfolk Island",
        "alpha2Code": "NF"
    },
    {
        "flag": "https://restcountries.eu/data/prk.svg",
        "name": "Korea (Democratic People's Republic of)",
        "alpha2Code": "KP"
    },
    {
        "flag": "https://restcountries.eu/data/mnp.svg",
        "name": "Northern Mariana Islands",
        "alpha2Code": "MP"
    },
    {
        "flag": "https://restcountries.eu/data/nor.svg",
        "name": "Norway",
        "alpha2Code": "NO"
    },
    {
        "flag": "https://restcountries.eu/data/omn.svg",
        "name": "Oman",
        "alpha2Code": "OM"
    },
    {
        "flag": "https://restcountries.eu/data/pak.svg",
        "name": "Pakistan",
        "alpha2Code": "PK"
    },
    {
        "flag": "https://restcountries.eu/data/plw.svg",
        "name": "Palau",
        "alpha2Code": "PW"
    },
    {
        "flag": "https://restcountries.eu/data/pse.svg",
        "name": "Palestine, State of",
        "alpha2Code": "PS"
    },
    {
        "flag": "https://restcountries.eu/data/pan.svg",
        "name": "Panama",
        "alpha2Code": "PA"
    },
    {
        "flag": "https://restcountries.eu/data/png.svg",
        "name": "Papua New Guinea",
        "alpha2Code": "PG"
    },
    {
        "flag": "https://restcountries.eu/data/pry.svg",
        "name": "Paraguay",
        "alpha2Code": "PY"
    },
    {
        "flag": "https://restcountries.eu/data/per.svg",
        "name": "Peru",
        "alpha2Code": "PE"
    },
    {
        "flag": "https://restcountries.eu/data/phl.svg",
        "name": "Philippines",
        "alpha2Code": "PH"
    },
    {
        "flag": "https://restcountries.eu/data/pcn.svg",
        "name": "Pitcairn",
        "alpha2Code": "PN"
    },
    {
        "flag": "https://restcountries.eu/data/pol.svg",
        "name": "Poland",
        "alpha2Code": "PL"
    },
    {
        "flag": "https://restcountries.eu/data/prt.svg",
        "name": "Portugal",
        "alpha2Code": "PT"
    },
    {
        "flag": "https://restcountries.eu/data/pri.svg",
        "name": "Puerto Rico",
        "alpha2Code": "PR"
    },
    {
        "flag": "https://restcountries.eu/data/qat.svg",
        "name": "Qatar",
        "alpha2Code": "QA"
    },
    {
        "flag": "https://restcountries.eu/data/kos.svg",
        "name": "Republic of Kosovo",
        "alpha2Code": "XK"
    },
    {
        "flag": "https://restcountries.eu/data/reu.svg",
        "name": "Réunion",
        "alpha2Code": "RE"
    },
    {
        "flag": "https://restcountries.eu/data/rou.svg",
        "name": "Romania",
        "alpha2Code": "RO"
    },
    {
        "flag": "https://restcountries.eu/data/rus.svg",
        "name": "Russian Federation",
        "alpha2Code": "RU"
    },
    {
        "flag": "https://restcountries.eu/data/rwa.svg",
        "name": "Rwanda",
        "alpha2Code": "RW"
    },
    {
        "flag": "https://restcountries.eu/data/blm.svg",
        "name": "Saint Barthélemy",
        "alpha2Code": "BL"
    },
    {
        "flag": "https://restcountries.eu/data/shn.svg",
        "name": "Saint Helena, Ascension and Tristan da Cunha",
        "alpha2Code": "SH"
    },
    {
        "flag": "https://restcountries.eu/data/kna.svg",
        "name": "Saint Kitts and Nevis",
        "alpha2Code": "KN"
    },
    {
        "flag": "https://restcountries.eu/data/lca.svg",
        "name": "Saint Lucia",
        "alpha2Code": "LC"
    },
    {
        "flag": "https://restcountries.eu/data/maf.svg",
        "name": "Saint Martin (French part)",
        "alpha2Code": "MF"
    },
    {
        "flag": "https://restcountries.eu/data/spm.svg",
        "name": "Saint Pierre and Miquelon",
        "alpha2Code": "PM"
    },
    {
        "flag": "https://restcountries.eu/data/vct.svg",
        "name": "Saint Vincent and the Grenadines",
        "alpha2Code": "VC"
    },
    {
        "flag": "https://restcountries.eu/data/wsm.svg",
        "name": "Samoa",
        "alpha2Code": "WS"
    },
    {
        "flag": "https://restcountries.eu/data/smr.svg",
        "name": "San Marino",
        "alpha2Code": "SM"
    },
    {
        "flag": "https://restcountries.eu/data/stp.svg",
        "name": "Sao Tome and Principe",
        "alpha2Code": "ST"
    },
    {
        "flag": "https://restcountries.eu/data/sau.svg",
        "name": "Saudi Arabia",
        "alpha2Code": "SA"
    },
    {
        "flag": "https://restcountries.eu/data/sen.svg",
        "name": "Senegal",
        "alpha2Code": "SN"
    },
    {
        "flag": "https://restcountries.eu/data/srb.svg",
        "name": "Serbia",
        "alpha2Code": "RS"
    },
    {
        "flag": "https://restcountries.eu/data/syc.svg",
        "name": "Seychelles",
        "alpha2Code": "SC"
    },
    {
        "flag": "https://restcountries.eu/data/sle.svg",
        "name": "Sierra Leone",
        "alpha2Code": "SL"
    },
    {
        "flag": "https://restcountries.eu/data/sgp.svg",
        "name": "Singapore",
        "alpha2Code": "SG"
    },
    {
        "flag": "https://restcountries.eu/data/sxm.svg",
        "name": "Sint Maarten (Dutch part)",
        "alpha2Code": "SX"
    },
    {
        "flag": "https://restcountries.eu/data/svk.svg",
        "name": "Slovakia",
        "alpha2Code": "SK"
    },
    {
        "flag": "https://restcountries.eu/data/svn.svg",
        "name": "Slovenia",
        "alpha2Code": "SI"
    },
    {
        "flag": "https://restcountries.eu/data/slb.svg",
        "name": "Solomon Islands",
        "alpha2Code": "SB"
    },
    {
        "flag": "https://restcountries.eu/data/som.svg",
        "name": "Somalia",
        "alpha2Code": "SO"
    },
    {
        "flag": "https://restcountries.eu/data/zaf.svg",
        "name": "South Africa",
        "alpha2Code": "ZA"
    },
    {
        "flag": "https://restcountries.eu/data/sgs.svg",
        "name": "South Georgia and the South Sandwich Islands",
        "alpha2Code": "GS"
    },
    {
        "flag": "https://restcountries.eu/data/kor.svg",
        "name": "Korea (Republic of)",
        "alpha2Code": "KR"
    },
    {
        "flag": "https://restcountries.eu/data/ssd.svg",
        "name": "South Sudan",
        "alpha2Code": "SS"
    },
    {
        "flag": "https://restcountries.eu/data/esp.svg",
        "name": "Spain",
        "alpha2Code": "ES"
    },
    {
        "flag": "https://restcountries.eu/data/lka.svg",
        "name": "Sri Lanka",
        "alpha2Code": "LK"
    },
    {
        "flag": "https://restcountries.eu/data/sdn.svg",
        "name": "Sudan",
        "alpha2Code": "SD"
    },
    {
        "flag": "https://restcountries.eu/data/sur.svg",
        "name": "Suriname",
        "alpha2Code": "SR"
    },
    {
        "flag": "https://restcountries.eu/data/sjm.svg",
        "name": "Svalbard and Jan Mayen",
        "alpha2Code": "SJ"
    },
    {
        "flag": "https://restcountries.eu/data/swz.svg",
        "name": "Swaziland",
        "alpha2Code": "SZ"
    },
    {
        "flag": "https://restcountries.eu/data/swe.svg",
        "name": "Sweden",
        "alpha2Code": "SE"
    },
    {
        "flag": "https://restcountries.eu/data/che.svg",
        "name": "Switzerland",
        "alpha2Code": "CH"
    },
    {
        "flag": "https://restcountries.eu/data/syr.svg",
        "name": "Syrian Arab Republic",
        "alpha2Code": "SY"
    },
    {
        "flag": "https://restcountries.eu/data/twn.svg",
        "name": "Taiwan",
        "alpha2Code": "TW"
    },
    {
        "flag": "https://restcountries.eu/data/tjk.svg",
        "name": "Tajikistan",
        "alpha2Code": "TJ"
    },
    {
        "flag": "https://restcountries.eu/data/tza.svg",
        "name": "Tanzania, United Republic of",
        "alpha2Code": "TZ"
    },
    {
        "flag": "https://restcountries.eu/data/tha.svg",
        "name": "Thailand",
        "alpha2Code": "TH"
    },
    {
        "flag": "https://restcountries.eu/data/tls.svg",
        "name": "Timor-Leste",
        "alpha2Code": "TL"
    },
    {
        "flag": "https://restcountries.eu/data/tgo.svg",
        "name": "Togo",
        "alpha2Code": "TG"
    },
    {
        "flag": "https://restcountries.eu/data/tkl.svg",
        "name": "Tokelau",
        "alpha2Code": "TK"
    },
    {
        "flag": "https://restcountries.eu/data/ton.svg",
        "name": "Tonga",
        "alpha2Code": "TO"
    },
    {
        "flag": "https://restcountries.eu/data/tto.svg",
        "name": "Trinidad and Tobago",
        "alpha2Code": "TT"
    },
    {
        "flag": "https://restcountries.eu/data/tun.svg",
        "name": "Tunisia",
        "alpha2Code": "TN"
    },
    {
        "flag": "https://restcountries.eu/data/tur.svg",
        "name": "Turkey",
        "alpha2Code": "TR"
    },
    {
        "flag": "https://restcountries.eu/data/tkm.svg",
        "name": "Turkmenistan",
        "alpha2Code": "TM"
    },
    {
        "flag": "https://restcountries.eu/data/tca.svg",
        "name": "Turks and Caicos Islands",
        "alpha2Code": "TC"
    },
    {
        "flag": "https://restcountries.eu/data/tuv.svg",
        "name": "Tuvalu",
        "alpha2Code": "TV"
    },
    {
        "flag": "https://restcountries.eu/data/uga.svg",
        "name": "Uganda",
        "alpha2Code": "UG"
    },
    {
        "flag": "https://restcountries.eu/data/ukr.svg",
        "name": "Ukraine",
        "alpha2Code": "UA"
    },
    {
        "flag": "https://restcountries.eu/data/are.svg",
        "name": "United Arab Emirates",
        "alpha2Code": "AE"
    },
    {
        "flag": "https://restcountries.eu/data/gbr.svg",
        "name": "United Kingdom of Great Britain and Northern Ireland",
        "alpha2Code": "GB"
    },
    {
        "flag": "https://restcountries.eu/data/usa.svg",
        "name": "United States of America",
        "alpha2Code": "US"
    },
    {
        "flag": "https://restcountries.eu/data/ury.svg",
        "name": "Uruguay",
        "alpha2Code": "UY"
    },
    {
        "flag": "https://restcountries.eu/data/uzb.svg",
        "name": "Uzbekistan",
        "alpha2Code": "UZ"
    },
    {
        "flag": "https://restcountries.eu/data/vut.svg",
        "name": "Vanuatu",
        "alpha2Code": "VU"
    },
    {
        "flag": "https://restcountries.eu/data/ven.svg",
        "name": "Venezuela (Bolivarian Republic of)",
        "alpha2Code": "VE"
    },
    {
        "flag": "https://restcountries.eu/data/vnm.svg",
        "name": "Viet Nam",
        "alpha2Code": "VN"
    },
    {
        "flag": "https://restcountries.eu/data/wlf.svg",
        "name": "Wallis and Futuna",
        "alpha2Code": "WF"
    },
    {
        "flag": "https://restcountries.eu/data/esh.svg",
        "name": "Western Sahara",
        "alpha2Code": "EH"
    },
    {
        "flag": "https://restcountries.eu/data/yem.svg",
        "name": "Yemen",
        "alpha2Code": "YE"
    },
    {
        "flag": "https://restcountries.eu/data/zmb.svg",
        "name": "Zambia",
        "alpha2Code": "ZM"
    },
    {
        "flag": "https://restcountries.eu/data/zwe.svg",
        "name": "Zimbabwe",
        "alpha2Code": "ZW"
    }
]};

const reducers = (state = initialState, action) => ({ ...state, ...action.payload });

export default reducers;
