import Charts
import SwiftUI

struct AnimatedLines: View {

  @ObservedObject var chartSystem = LineChartSystem(lineCount: 5)

  var body: some View {

    LinearGradient(colors: chartSystem.colors, startPoint: .leading, endPoint: .trailing)
      .mask {
        ZStack {
          Chart(chartSystem.lines) { line in
            ForEach(line.points) { point in
              LineMark(
                x: .value("", point.x),
                y: .value("", (point.x == 0 || point.x == line.points.count - 1) ? 0 : point.y)
              )
              .interpolationMethod(Charts.InterpolationMethod.cardinal)
              .foregroundStyle(by: .value("", line.id))
            }
          }
          .chartYScale(range: -50...50)
          .chartYAxis(.hidden)
          .chartXAxis(.hidden)
          .chartLegend(.hidden)
        }.frame(height: 15)

      }.frame(height: 60)

  }
}

struct ChartPoint: Identifiable {
  let id = UUID()
  let x: Int
  var y: Double
}

struct ChartLine: Identifiable {
  let id: String = "\(UUID())"
  var points: [ChartPoint]
}

class LineChartSystem: ObservableObject {
  @Published var lines: [ChartLine] = []
  @Published var speed: Double = 8.0
  @Published var colors: [Color] = [.green, .orange, .blue, .purple, .red]

  private var timer: Timer?
  // var incrementSpeed: (() -> Void)?

  init(lineCount: Int) {
    for _ in 0..<lineCount {
      var chartLine = ChartLine(points: [])
      for j in 0..<5 {
        chartLine.points.append(ChartPoint(x: j, y: 0))
      }
      lines.append(chartLine)
    }

    update()
  }

  func update() {

    Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { timer in
      for i in 0..<self.lines.count {
        for j in 0..<self.lines[i].points.count {
          let point = self.lines[i].points[j]
          let random = Double.random(in: -50...50)
          if point.y + random < 50 && point.y + random > -50 {
            withAnimation(.linear(duration: self.speed)) {
              self.lines[i].points[j].y += random
            }
          }
        }
      }
    }
  }
}

@objc
class AnimatedLinesProvider: UIViewController, SwiftUIProvider {
  private var swiftUI: AnimatedLines?
  // MARK: INIT

  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  required public init() {
    super.init(nibName: nil, bundle: nil)
  }

  public override func viewDidLoad() {
    super.viewDidLoad()
  }

  // MARK: PRIVATE

  /// Receive data from NativeScript
  func updateData(data: NSDictionary) {

    if self.swiftUI == nil {
      swiftUI = AnimatedLines()
      setupSwiftUIView(content: swiftUI)
    }

    if let colors = data.value(forKey: "colors") as? [String] {

      var swiftColors: [Color] = []
      colors.forEach { color in
        swiftColors.append(Color(hex: color)!)
      }
      swiftUI!.chartSystem.colors = swiftColors

      if let speed = data.value(forKey: "speed") as? Double {
        swiftUI!.chartSystem.speed = speed
      }

      swiftUI!.chartSystem.update()
    } else if let speed = data.value(forKey: "speed") as? Double {
      swiftUI!.chartSystem.speed = speed
      swiftUI!.chartSystem.update()
    }

  }

  /// Allow sending of data to NativeScript
  var onEvent: ((NSDictionary) -> Void)?
}
