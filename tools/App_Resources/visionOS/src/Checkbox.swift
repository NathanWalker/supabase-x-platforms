//
//  Checkbox.swift
//  Checkbox
//
//  Created by Nandesora Tjihero on 3/4/23.
//

import SwiftUI

class CheckboxData: ObservableObject {
  @Published var id: Int = 0
  @Published var done: Bool = false
  @Published var color: Color = .yellow
  @Published var size: CGFloat = 50
  @Published var checkboxOutlineType: String = "circle"
  var changeDone: (() -> Void)?
}

struct Checkbox: View {
  @ObservedObject var data: CheckboxData

  var body: some View {
    Button(
      action: {
        data.done.toggle()
        self.data.changeDone?()
      },
      label: {
        Label(
          "Checkbox",
          systemImage: data.done
            ? "checkmark.\(self.data.checkboxOutlineType).fill"
            : "\(self.data.checkboxOutlineType)"
        )  // checkbox icon
        .labelStyle(.iconOnly)
        .foregroundColor(data.color)  //checkbox color
        .font(.system(size: data.size))

      })
  }
}

@objc
class CheckboxProvider: UIViewController, SwiftUIProvider {
  private var checkboxState = CheckboxData()
  private var swiftUI: Checkbox?
  // MARK: INIT

  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  required public init() {
    super.init(nibName: nil, bundle: nil)
  }

  public override func viewDidLoad() {
    super.viewDidLoad()
    registerObservers()
  }

  private func registerObservers() {
    checkboxState.changeDone = {
      self.onEvent?([
        "id": self.swiftUI!.data.id,
        "done": self.swiftUI!.data.done,
      ])
    }
  }
  // MARK: PRIVATE
  /// Receive data from NativeScript
  func updateData(data: NSDictionary) {
    let enumerator = data.keyEnumerator()
    while let k = enumerator.nextObject() {
      let key = k as! String
      let v = data.object(forKey: key)
      if v != nil {
        if key == "id" {
          checkboxState.id = v as! Int
        } else if key == "color" {
          checkboxState.color = Color(hex: v as! String)!
        } else if key == "size" {
          checkboxState.size = v as! CGFloat
        } else if key == "checkboxOutlineType" {
          checkboxState.checkboxOutlineType = v as! String
        } else if key == "done" {
          checkboxState.done = v as! Bool
        }
      }
    }
    if self.swiftUI == nil {
      swiftUI = Checkbox(data: checkboxState)
      setupSwiftUIView(content: swiftUI)
    } else {
      swiftUI!.data = checkboxState
    }

  }

  /// Allow sending of data to NativeScript
  var onEvent: ((NSDictionary) -> Void)?
}
