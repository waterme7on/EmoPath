//
//  Item.swift
//  EmoPath
//
//  Created by waterme7on on 2024/9/13.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
