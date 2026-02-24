# @solufy/evolution-sdk

## 1.0.1

### Patch Changes

- b7cbbf4: Fix instance connection response schema

## 1.0.0

### Major Changes

- 899b7c3: BREAKING: New `EvolutionInstance` for instance requests and changed `EvolutionClient` to non-instance requests.

### Minor Changes

- 8c0d544: Improved error structure to include an unique code and instance property.
- ad22018: New instances module for finding and managing instances

## 0.2.6

### Patch Changes

- cd3ec0e: Fix video caption being required.

## 0.2.5

### Patch Changes

- a8ad971: Use libphonenumber-js/min to reduce bundle size.

## 0.2.4

### Patch Changes

- 03957dd: Migrate to Zod Mini to reduce bundle size and increase performance.

## 0.2.3

### Patch Changes

- 403fbe6: Fix sending messages to groups

## 0.2.2

### Patch Changes

- 9003f4a: Replace `{{greeting}}` with with time-based greeting in pt-BR at all messages and captions.

## 0.2.1

### Patch Changes

- 35a7989: Include instance in error messages.
- 1638df7: Add AggregateError to mapped errors

## 0.2.0

### Minor Changes

- 155b3de: Improved error messages

## 0.1.2

### Patch Changes

- d8bcc58: Fix waveform parsing error.

## 0.1.1

### Patch Changes

- bffe8f7: Fix API response validation

## 0.1.0

### Minor Changes

- 308a394: **Chats module** for finding chats, sending presences and checking numbers
- 308a394: **Messages module** for sending messages
- 308a394: **Groups module** for finding groups
