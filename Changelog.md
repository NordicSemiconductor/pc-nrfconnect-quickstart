## 0.2.7 - 2024-08-07

### Added

-   Option to program and evaluate the nRF Cloud multi-service firmware on the
    nRF9161 DK and the nRF9151 DK.
-   `SIM Card` step for nRF9151 DK and nRF9161 DK.

### Changed

-   `Verify` step starts verifying automatically.

## 0.2.6 - 2024-04-12

### Changed

-   Updated Nordic Semiconductor documentation links.

### Fixed

-   Skip button is now shown consistently upon failure in the verification step.
-   Modem firmware version v2.0.1 was wrongly displayed as v2.0.0 for nRF9151 DK
    and nRF9161 DK.

## 0.2.5 - 2024-03-26

### Changed

-   Updated mfw for nRF9151 DK and nRF9161 DK to 2.0.1.

## 0.2.4 - 2024-03-20

### Added

-   Information on high power consumption for related firmware files.

## 0.2.3 - 2024-03-13

### Changed

-   Increased required nRF Connect for Desktop version to 4.4.1.

## 0.2.2 - 2024-02-23

### Changed

-   Lowered required nRF Connect for Desktop version to 4.4.0.

## 0.2.1 - 2024-02-21

### Added

-   Support for nRF9151 DK.
-   Better usage data.
-   `Program` step now ensures that device is connected before programming.

### Changed

-   Improved error/notice UI.

### Fixed

-   Reading the ICCID value sometimes never finished.
-   Incorrect button label when failing to program.

## 0.2.0 - 2023-12-07

### Added

-   `SIM Card` step for nRF9160 DK.

### Fixed

-   Failed to list devices sometimes.

### Removed

-   `Activate SIM Card` option in evaluate step for nRF9160 DK.

## 0.1.0 - 2023-09-28

-   Initial public release
