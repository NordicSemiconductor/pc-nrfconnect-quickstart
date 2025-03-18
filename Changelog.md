## 1.2.1 - UNRELEASED

### Added

-   Notification that informs user if device is disconnected in relevant steps.

## 1.2.0 - 2024-12-06

### Changed

-   The Evaluation step for the Nordic Thingy:91 X now reads the attestation
    token and directs you to nRF Cloud.

## 1.1.0 - 2024-11-29

### Added

-   Support for Nordic Thingy:91 X.

### Changed

-   Updated modem firmware packages for nRF9151 DK and nRF9161 DK to 2.0.2.
-   Updated modem firmware packages for nRF9160 DK to 1.3.7.

### Fixed

-   Some cases when programming the network core on the nRF5340 DK would fail.

## 1.0.1 - 2024-11-11

### Changed

-   Updated `nrfutil device` to v2.6.4.

## 1.0.0 - 2024-10-10

### Added

-   Opening the nRF Connect Serial Terminal app from the Evaluate step now
    always automatically selects the correct serial port.
-   Support for the nRF54L15 DK, nRF5340 DK, nRF52 DK, nRF52840 DK, and nRF52833
    DK.
-   New learning resource links in the Learn step for the nRF9151 DK, nRF9160 DK
    and nRF9161 DK.
-   Automatic selection of the device if only one is connected when at the
    Select step.

## 0.3.0 - 2024-09-04

### Changed

-   Improved the verify step stability for the nRF9160 DK, the nRF9161 DK, and
    the nRF9151 DK.

### Fixed

-   The hardware documentation links for the nRF9151 DK and nRF9160 DK that led
    to non-existent pages.

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
