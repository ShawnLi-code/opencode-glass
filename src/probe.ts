import { Plugin, Command, Slot } from "@opencode/plugin/gui"

export default Plugin.define({
  main(ctx) {
    ctx.log.write("info", "GLASS_PROBE_V1 main started")
  },
  setup(ctx) {
    console.info("GLASS_PROBE_V1 window started")
    ctx.add(Command, {
      id: "probe",
      title: "Glass Probe V1",
      run: () => console.info("GLASS_PROBE_V1 command executed"),
    })
    ctx.add(Slot, {
      at: "window.bottom",
      render: () => "Glass Probe V1 — GUI loaded",
    })
  },
})
