import type { MutableRefObject } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import type { ChromaticAberrationEffect } from 'postprocessing'

export default function Effects({
  ca,
  bloom = 0.9,
}: {
  ca: MutableRefObject<ChromaticAberrationEffect | null>
  bloom?: number
}) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={bloom} luminanceThreshold={1.0} luminanceSmoothing={0.15} radius={0.72} />
      <ChromaticAberration ref={ca} offset={[0.0004, 0.0003] as never} radialModulation={false} modulationOffset={0} />
      <Vignette eskil={false} offset={0.28} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
