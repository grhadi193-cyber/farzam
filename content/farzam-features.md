# MyFarzam product capability map

## Product summary

MyFarzam is a Persian, RTL fleet-management application for GPS tracking hardware. It combines a live fleet map, device inventory, aggregate operational analytics, geofencing, alerts, and report generation. A customer first registers each tracker by device identifier (IMEI/ID), tracker model, SIM-card number, time basis, and a vehicle/person label. The dashboard turns received telemetry into fleet status counts and period-based speed, distance, and stop charts. The product supports both personal subscriptions and organisation subscriptions; the observed organisation account additionally exposes group-level and multi-device reporting workflows. The UI also shows subscription validity, connection/last-position recency, and system/maintenance notifications. The report layer is built around a device or group selection plus a time range, and exports to Excel only after results have been generated.

## Menu and page tree

- **Dashboard / داشبورد مدیریتی**
  - Fleet KPIs, heatmap entry point, 7-day / 2-week / 1-month chart ranges
- **Devices map / نقشه دستگاه‌ها**
  - Map, device-and-group picker, map layers, zoom, fullscreen
- **Device management / مدیریت دستگاه‌ها**
  - Device list; map view; search; group filter; pagination; refresh; add device
  - Add device / افزودن دستگاه
- **Groups / مدیریت گروه‌ها**
  - Search, add group, group device counts, pagination
- **Geofences / مدیریت محدوده‌ها**
  - Search, add geofence, circle/polygon drawing, speed limit, pagination
- **Notifications / اعلان‌ها**
  - Alerts; Maintenance; System
- **Reports / گزارش‌ها**
  - Route / پیمایش; Event / رویداد; Daily / روزانه; Performance / عملکرد; Stop / توقف; Trip / سفر; Geofence / محدوده; Heatmap / نقشه حرارتی; Temperature / دما
- **Profile / پروفایل**
  - Sign-in information, password/session controls, language, calendar, timezone, notification settings
- **Support / پشتیبانی**
  - Phone and messaging-channel contacts

## Capability details

### Dashboard / داشبورد مدیریتی

- **Path:** Dashboard.
- **Customer problem:** Gives an operator a fast answer to “how many units are in the fleet, online, moving, and recently located?” without opening each tracker.
- **Inputs:** Time period buttons: last 7 days, 2 weeks, or 1 month; heatmap entry.
- **Outputs:** Total devices, powered-on devices, moving devices, devices with an active location; highest speed, longest distance, average speed, and stop-count charts.
- **Hardware dependency:** GPS tracker telemetry; movement/ignition status is tracker-dependent.
- **Visual/data type:** KPI cards, time-series and bar charts, heatmap entry.

### Devices map / نقشه دستگاه‌ها

- **Path:** Devices map.
- **Customer problem:** Locates fleet units spatially and narrows the visible fleet to a group or device.
- **Inputs:** Device/group picker, map layers, zoom and fullscreen controls.
- **Outputs:** Map markers and tracker labels; selected-device details were intentionally not opened because they may expose precise customer location.
- **Hardware dependency:** GPS location and tracker connectivity.
- **Visual/data type:** Interactive map.

### Device management / مدیریت دستگاه‌ها

- **Path:** Device management > Device list or Map view.
- **Customer problem:** Maintains the registered tracker inventory and makes freshness, subscription, and grouping visible at a glance.
- **Inputs:** Text search, group filter, page-size selector, pagination, list refresh.
- **Outputs:** Device/vehicle label, device identifier, SIM number, plate, last-position time, last-connection time, subscription type/expiry, and operation controls.
- **Hardware dependency:** Tracker identifier, SIM, GPS/connection telemetry.
- **Visual/data type:** Paginated table and map.

### Add device / افزودن دستگاه

- **Path:** Device management > Add device.
- **Customer problem:** Connects a physical tracker to the software account.
- **Inputs:** Required device IMEI/ID, tracker model, device SIM-card number, vehicle/person label; UTC (default) or local device time; local timezone when local-time mode applies; optional plate classification and plate fields.
- **Outputs:** A registered device record after “Register and continue”. The submission was not used.
- **Hardware dependency:** Directly dependent on a compatible tracker, its IMEI/ID, and cellular SIM.
- **Visual/data type:** Hardware onboarding form.

### Groups / مدیریت گروه‌ها

- **Path:** Groups.
- **Customer problem:** Lets an organisation organize a fleet for filtering, map use, and consolidated reports.
- **Inputs:** Search and add-group flow.
- **Outputs:** Group name and number of devices per group.
- **Hardware dependency:** Software-only grouping over registered devices.
- **Visual/data type:** Table with pagination.

### Geofences / مدیریت محدوده‌ها

- **Path:** Geofences > Add geofence.
- **Customer problem:** Defines meaningful places and supports later inside/outside analysis and geographic events.
- **Inputs:** Name, description, maximum speed, and map geometry: polyline, polygon, or circle.
- **Outputs:** Named boundary with geometry, type, and optional speed limit.
- **Hardware dependency:** GPS tracker location; speed-limit use depends on reported speed.
- **Visual/data type:** Drawing map and management table.

### Notifications / اعلان‌ها

- **Path:** Notifications > Alerts | Maintenance | System.
- **Customer problem:** Surfaces operational changes and service/subscription risks without requiring continuous map monitoring.
- **Inputs:** Tab selection only observed.
- **Outputs:**
  - **Alerts:** ignition on/off, movement start, stop, and optional map location.
  - **Maintenance:** scheduled-maintenance notices and their text parameters.
  - **System:** no-new-data, subscription-expiry, and subscription-reminder notices.
- **Hardware dependency:** Alerts depend on tracker status, GPS/motion and any configured sensor/event source; maintenance and subscription notices are software/service data.
- **Visual/data type:** Chronological notification feed.

### Route report / گزارش پیمایش

- **Path:** Reports > Route.
- **Customer problem:** Reconstructs a tracker’s path for a chosen period.
- **Inputs:** One device selector (multi-select was not indicated by the observed control); quick period: last hour, today, yesterday, or custom; optional disable-zero-speed filter, GPS-jamming/long-distance cleanup, and include point voltage.
- **Outputs:** Route map; Excel becomes available after results exist.
- **Hardware dependency:** GPS points; optional voltage requires compatible power telemetry.
- **Visual/data type:** Map, filters, export.

### Event report / گزارش رویداد

- **Path:** Reports > Event.
- **Customer problem:** Finds specific operational events in a time window.
- **Inputs:** One device selector, quick period or custom range, and multi-select event types: inactive, movement start, stop, overspeed, fuel leak, geofence enter, geofence exit, warning, ignition on, ignition off, maintenance.
- **Outputs:** Event time, type, address, details; Excel export after results.
- **Hardware dependency:** GPS/ignition/motion; fuel-leak events require compatible fuel sensing; geofence events require GPS plus geofences.
- **Visual/data type:** Filterable event table.

### Daily report / گزارش روزانه

- **Path:** Reports > Daily.
- **Customer problem:** Summarises one device’s operating day or shift window.
- **Inputs:** Device, start/end date and time, working-day start and working-day end.
- **Outputs:** Start/end time, first ignition on, last ignition off, distance, average/max speed, total stop/movement/ignition/idle time, and fuel consumption per 100 km; Excel export after results.
- **Hardware dependency:** GPS, speed, ignition; fuel-consumption result requires available fuel calculation/telemetry.
- **Visual/data type:** Summary table and filter drawer.

### Performance report / گزارش عملکرد

- **Path:** Reports > Performance.
- **Customer problem:** Compares several assets or a whole group across a time range.
- **Inputs:** Optional group selector, **multi-device** selector, start/end date and time.
- **Outputs:** Vehicle/person label, start/end, distance, average/max speed, total stop/movement/ignition time, fuel consumption; Excel export after results.
- **Hardware dependency:** Same telemetry as Daily; multi-device selection is especially useful for organisational fleets.
- **Visual/data type:** Comparative table.

### Stop report / گزارش توقف

- **Path:** Reports > Stop.
- **Customer problem:** Finds dwell/idle locations and ignores unimportant short or long stops.
- **Inputs:** Device, start/end date and time, minimum and maximum stop duration. The observed options span unlimited, minutes, hours, and multiple days.
- **Outputs:** Start time, end time, stop duration, address, and row actions; Excel export after results.
- **Hardware dependency:** GPS and speed/stop detection.
- **Visual/data type:** Filterable table.

### Trip report / گزارش سفر

- **Path:** Reports > Trip.
- **Customer problem:** Breaks a device’s operating period into journeys.
- **Inputs:** Device plus start/end date and time.
- **Outputs:** Start time, end time, distance, average speed, maximum speed; Excel export after results.
- **Hardware dependency:** GPS and movement detection.
- **Visual/data type:** Table.

### Geofence report / گزارش محدوده

- **Path:** Reports > Geofence.
- **Customer problem:** Shows when an asset was inside or outside defined sites and how it operated there.
- **Inputs:** Device, start/end date and time, work-hour window, geofence selector (disabled until a prerequisite selection is made), inside and outside checkboxes.
- **Outputs:** Geofence name, inside/outside status, start/end, distance, average/max speed, total stop/movement/ignition time; Excel export after results.
- **Hardware dependency:** GPS plus stored geofence geometry.
- **Visual/data type:** Table.

### Heatmap report / گزارش نقشه حرارتی

- **Path:** Reports > Heatmap.
- **Customer problem:** Reveals where the selected part of a fleet spends time or moves most often.
- **Inputs:** Optional group, **multi-device** selector, start/end date and time.
- **Outputs:** Geographic heatmap.
- **Hardware dependency:** GPS location points.
- **Visual/data type:** Interactive map.

### Temperature report / گزارش دما

- **Path:** Reports > Temperature.
- **Customer problem:** Retrieves temperature history for a tracker, useful for cold-chain or environment monitoring.
- **Inputs:** Device plus start/end date and time.
- **Outputs:** Time and temperature rows.
- **Hardware dependency:** Temperature-capable tracker or attached temperature sensor; exact supported sensor models were not exposed.
- **Visual/data type:** Table.

### Profile and application settings / پروفایل

- **Path:** Profile.
- **Customer problem:** Keeps account access and local presentation preferences manageable.
- **Inputs:** Profile identity fields, password/session controls, app language, calendar, timezone, notification settings.
- **Outputs:** Account/session state and applied local preferences.
- **Hardware dependency:** Software-only.
- **Visual/data type:** Settings sections.

### Support / پشتیبانی

- **Path:** Support.
- **Customer problem:** Gives users a direct route to help.
- **Inputs:** Support-channel link selection.
- **Outputs:** Phone and messaging-channel handoffs.
- **Hardware dependency:** Software/service-only.
- **Visual/data type:** Contact links.

## Personal vs organisational use

| Scenario | Observed fit | Key product behaviour |
|---|---|---|
| Personal subscription | Single vehicle/person label, individual device reports, map and alerts | Device-list subscription badges included a personal tier; most report forms begin with one device selector. |
| Organisational subscription | Groups, fleet dashboard, group filtering, multi-device reports, comparison/heatmap | Device-list badges included an organisational tier. Performance and Heatmap explicitly offer group plus multi-device selection. |
| Base subscription | Present as a subscription label | Feature entitlement differences were not exposed in this account. |

## Hardware-to-software relationship

| Hardware or sensor | Software capabilities fed |
|---|---|
| GPS tracker with IMEI/ID | Device registration, live map, route/trip/stop/geofence/heatmap reports, last-position freshness |
| Tracker cellular SIM | Registration, connection state, last-connection timestamp, no-new-data alerts |
| Ignition/power input | Powered-on dashboard KPI, ignition on/off alerts, Daily/Performance ignition-time fields |
| Motion and speed telemetry | Moving KPI, movement/stop alerts, speed charts, route/trip/daily/performance/stop reports |
| Voltage/power telemetry | Optional route-point voltage output |
| Temperature sensor or temperature-capable tracker | Temperature report |
| Fuel sensor or compatible fuel calculation | Fuel-leak event and fuel-consumption fields; exact sensor/model compatibility is unknown |
| Geofence geometry (software configuration) + GPS | Enter/exit events and Geofence report |

## Locked, disabled, or plan-sensitive capabilities observed

- Excel export buttons were disabled before any report result was generated.
- The Geofence report’s geofence selector was disabled before prerequisite selections were completed.
- The device picker displayed some trackers as inactive, powered off, or with invalid subscription; those status labels indicate availability constraints, not a separate product plan.
- Personal, organisational, and base subscription labels were visible, but entitlement differences between them were not visible.

## Unseen or uncertain items

- Tracker-model dropdown values and supported device/sensor matrix: not shown without entering device-registration information.
- Device-row operation icons and any command-to-device controls: deliberately not opened because their action could edit, send a command, or otherwise change state.
- Custom date-range fields for Route and Event: selecting “custom” would change the active filter; not done under the observation-only rule.
- Generated report rows, Excel files, and drill-down row actions: deliberately not run or exported to avoid exposing customer data.
- Device-map selected-marker panel: deliberately not opened because it could expose precise location and identity.
- Mobile layouts: not captured because the requested deliverables prioritised desktop and changing viewport would not add safe product evidence.
