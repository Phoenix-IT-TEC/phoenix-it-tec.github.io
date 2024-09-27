import type { PickStateRefValues } from '@wix/editor-elements-integrations';
import { withCompController } from '@wix/editor-elements-integrations';
import type { WRichTextProps } from '@wix/thunderbolt-components';
import { isExperimentOpen } from '@wix/editor-elements-common-utils';
import type { VerticalAlignTopExperiment } from '../WRichText.types';

// Should be removed after the specs.thunderbolt.WRichTextVerticalAlignTopSafariAndIOS experiment is open to 100%

export default withCompController<
  WRichTextProps,
  {},
  WRichTextProps & VerticalAlignTopExperiment,
  PickStateRefValues<'experiments'>
>(({ mapperProps, stateValues }) => {
  const { experiments = {} } = stateValues;
  const shouldFixVerticalTopAlignment = isExperimentOpen(
    experiments,
    'specs.thunderbolt.WRichTextVerticalAlignTopSafariAndIOS',
  );

  return {
    ...mapperProps,
    shouldFixVerticalTopAlignment,
  };
});
