
Bu layihəmdə istədim ki end-to-end pipeline yaradım.Məlumatlar OPENAQ platformasından REST API ilə çəkilir
daha sonra model validasiya olundur və databaseə göndərilir .

İstifadə olunan Toollar:

Pydantic    - Model Validasiya
Pytest      - Test
Loguru      - Logging
Postgresql  - Database
Docker      - Deployment

London şəhərinin hava kirliliyini ölçmək üçün istifadə edəciyik .
Batch data aws dən yüklənir (bulk formasında)
Real time isə yəni daha dəqiq micro batch data rest api dan alınır
Asinxron data fərqli data mənbələrinə görə ayrılır .
Hər mənbənin məlumatları bir database də fərqli schemada eyni adla saxlanılır
Data Validasiyası (micro batch üçün ) pydanticlə aparılır
Visualizasiya Metabaselə edilir .

# Ölkə və şəhərlərin longitude və latitude tapmaq üçün website linki

[Ölkə və şəhərlərin longitude və latitude tapmaq üçün website linki](latlong.net)


Open ap məlumatları haqqında detallı Məlumatlar

Ölçmələr (Measurements)

Nələr var:

Parametr: PM2.5, PM10, NO₂, O₃, CO, SO₂ və s.

Qiymət: konsentrasiyanın real ölçümü (µg/m³ və ya ppb).

Vahid: ölçmə vahidi.

Vaxt: timestamp, UTC.

Məntəqə: hansı stansiyadan gəldiyi.

Vacibliyi:

Hava keyfiyyətini real vaxt və tarixi olaraq izləməyə imkan verir.

PM2.5 və NO₂ kimi zərərli parametrlər insan sağlamlığı üçün kritikdir.

Analitik istifadəsi:

Trend analizi: hava keyfiyyətinin saatlıq/günlük dəyişimi.

Səbəb-nəticə araşdırması: yol trafikinin və sənaye fəaliyyəti ilə əlaqəsini yoxlamaq.

Forecasting: ML modellərlə hava keyfiyyətini proqnozlaşdırmaq.

Son ölçmələr (Latest)

Nələr var:

Hər stansiya üçün ən son oxunan parametrlər.

Vacibliyi:

Real-time monitorinq və xəbərdarlıq sistemləri üçün.

Analitik istifadəsi:

Dashboard-larda “hazır vəziyyət” göstərmək.

Threshold-lar keçəndə alert göndərmək (SMS, email, Telegram).

Məntəqələr / Stansiyalar (Locations)

Nələr var:

Stansiyanın adı, koordinatları, şəhər, ölkə, ölçən təşkilat, parametrlər.

Vacibliyi:

Coğrafi vizualizasiya üçün əsasdır.

Məlumatın mənbəyini doğrulamağa imkan verir.

Analitik istifadəsi:

Heatmap və xəritə vizualizasiyaları.

Müxtəlif bölgələr üzrə müqayisələr.

Ərazi üzrə trendlərin, hotspot-ların təhlili.

Parametrlər (Parameters)

Nələr var:

Hansı hava komponentləri ölçülür, təsviri, vahid.

Vacibliyi:

Analitiklər üçün hansı məlumatların mövcud olduğunu anlamaq üçün.

Analitik istifadəsi:

Qlobal və regional hava keyfiyyəti indeksi (AQI) hesablaması.

Parametrlər arasında korelyasiya analizi.

Sensor / Alət / İstehsalçı

Nələr var:

Sensorun tipi, ölçdüyü parametrlər, istehsalçı, operator.

Vacibliyi:

Ölçmələrin etibarlılığını qiymətləndirmək.

Analitik istifadəsi:

Sensor keyfiyyəti və kalibrləmə effektlərini təhlil etmək.

Məlumatın doğruluğunu artırmaq.

Tarixi / Arxiv Məlumat

Nələr var:

Əvvəlki illərə aid bütün ölçmələr.

Bulk formatda AWS S3 üzərindən yüklənə bilir.

Vacibliyi:

Uzunmüddətli trend analizi və tədqiqatlar üçün.

Analitik istifadəsi:

Seasonal pattern və dəyişikliklərin təhlili.

İqlim dəyişikliyi və urban pollution tədqiqatları.

Machine learning modelləri üçün təlim datası.

Nümunə Analitik İşlər

Dashboard / Real-time monitor: Son ölçmələri xəritədə və qrafikdə göstərmək.

Trend analizi: PM2.5-nin aylıq, illik dəyişimi, pik saatlar.

Korelasiya tədqiqatı: Hava keyfiyyəti vs. yol hərəkəti, sənaye fəaliyyəti.

Forecasting & Alerts: Machine learning ilə gələcək hava keyfiyyətini proqnozlaşdırmaq.

Health risk analysis: İnsan sağlamlığı üçün kritik günləri təyin etmək.
