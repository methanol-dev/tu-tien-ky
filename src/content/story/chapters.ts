import { REALM_INDEX_BY_ID as R } from '../realms'
import type { StoryChapter } from './types'

export const CHAPTERS: readonly StoryChapter[] = [
  {
    id: 'hoi-00',
    index: 0,
    title: 'Hồi 0: Ngõ Nê Bình',
    subtitle: 'Thiếu Niên Mang Giày Cỏ',
    summary: 'Trần Bình An mồ côi gánh nước làm gốm tại lò rồng Ly Châu Động Thiên, kiên định giữ tấm lòng thiện lương giữa muôn vàn trắc trở.',
    scenes: [
      {
        id: 'scene-0-1',
        chapterId: 'hoi-00',
        title: 'Cá Chép Bốn Râu & Lò Rồng',
        minRealmIndex: R['pham-tuc'],
        blocks: [
          {
            text: 'Ngõ Nê Bình quanh năm ngập trong bùn đất và sương mờ. Trong căn nhà đất rách nát, một thiếu niên mang giày cỏ, lưng cõng gùi trúc nhỏ đang cẩn thận nhóm bếp.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Cha mẹ mất sớm, lò gốm Long Diêu chỉ nhận làm thuê kiếm bát cơm. Người trong trấn nói ta số khổ, nhưng trời không tuyệt đường người.',
          },
          {
            text: 'Hôm nay khi gánh nước từ khe suối, một con cá chép bốn râu bỗng nhảy vào thùng nước của thiếu niên, ánh mắt dường như ẩn chứa linh tính thiên địa.',
          },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Thả cá chép về lại đầm nước khe suối (Giữ lòng thuần lương)',
            outcomeText: 'Cá chép bốn râu quẫy đuôi ba lần rồi lặn sâu, để lại một luồng thanh khí ôn hòa thấm vào kinh mạch thiếu niên.',
            rewardDescription: 'Tụ khí ban đầu gia tăng',
          },
          {
            id: 'c2',
            text: 'Đem cá biếu lão nhân coi lò gốm (Đổi lấy lời khuyên nung gốm)',
            outcomeText: 'Lão nhân vui vẻ nhận lấy, tiện tay gõ lên trán thiếu niên dạy cho khẩu quyết thổ nạp cơ bản của thợ gốm.',
            rewardDescription: 'Lĩnh hội bí quyết Khí Thao Long Diêu',
          },
        ],
      },
      {
        id: 'scene-0-2',
        chapterId: 'hoi-00',
        title: 'Lão Hòe Thụ Dưới Mưa',
        minRealmIndex: R['pham-tuc'],
        blocks: [
          {
            text: 'Mưa dầm rả rích dội lên mái ngói cổ trấn. Dưới gốc cây hòe ngàn năm, một vị tiên sinh mặc trường bào Nho nhã đang mỉm cười nhìn Trần Bình An.',
          },
          {
            speaker: 'Tề Tĩnh Xuân',
            text: 'Bình An, trên thế gian này có nhiều kẻ không chịu nói đạo lý. Nhưng chỉ cần trong lòng ngươi có đạo lý, thì bước chân đi đâu cũng không sợ lạc lối.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Tề tiên sinh, người ta nói trấn nhỏ sắp có biến cố lớn, ai cũng tranh nhau cơ duyên. Con là đứa trẻ mồ côi, cơ duyên của con là gì?',
          },
          {
            speaker: 'Tề Tĩnh Xuân',
            text: 'Cơ duyên lớn nhất của ngươi, chính là đôi chân chưa từng giẫm đạp lên lương tri. Cầm lấy thanh kiếm gỗ này, tương lai sẽ có lúc ngươi hiểu được ý nghĩa của nó.',
          },
        ],
      },
    ],
  },
  {
    id: 'hoi-01',
    index: 1,
    title: 'Hồi 1: Ly Châu Động Thiên',
    subtitle: 'Mưa Gió Trấn Nhỏ',
    summary: 'Động thiên sụp đổ, các thế lực ngoại nhân ùa vào trấn nhỏ tranh cướp cơ duyên. Gặp gỡ thiếu nữ kiếm tu Ninh Diêu, Tề tiên sinh một mình gánh thiên kiếp.',
    scenes: [
      {
        id: 'scene-1-1',
        chapterId: 'hoi-01',
        title: 'Thiếu Nữ Áo Xanh Cầm Kiếm',
        minRealmIndex: R['dong-bi-1'],
        blocks: [
          {
            text: 'Ngoại nhân từ các châu lớn lũ lượt kéo đến trấn nhỏ. Trong ngõ tối, một thiếu nữ áo xanh bị thương nặng đang cầm đoản kiếm dựa lưng vào bờ tường.',
          },
          {
            speaker: 'Ninh Diêu',
            text: 'Đừng lại gần! Ngươi là người trấn này? Bọn dã tu ngoài kia đang lùng sục kiếm tiên ta đấy.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Cô nương bị thương nặng quá. Nhà ta ở ngõ Nê Bình phía trước, có nước sạch và thuốc thảo mộc hái sau núi, cô nương có muốn vào tránh tạm không?',
          },
          {
            speaker: 'Ninh Diêu',
            text: 'Tên nhóc ngươi... nhìn thì khờ khạo, nhưng đôi mắt lại sáng như sao. Được rồi, nếu cứu ta, sau này ta dạy ngươi kiếm thuật!',
          },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Tận tình chăm sóc, chia sẻ dược thảo tốt nhất cho Ninh Diêu',
            outcomeText: 'Ninh Diêu gật đầu ghi nhận ân tình, chỉ điểm cho Trần Bình An thế đứng ngự kiếm cơ bản.',
            npcId: 'ninh-dieu',
            affinityDelta: 20,
            rewardDescription: 'Hảo cảm Ninh Diêu +20, lực chiến cơ bản tăng',
          },
          {
            id: 'c2',
            text: 'Cảnh giới bên ngoài canh chừng kẻ địch truy lùng',
            outcomeText: 'Trần Bình An cầm kiếm gỗ đứng canh đầu ngõ, tinh thần tập trung cao độ đột phá giới hạn nhạy bén.',
            npcId: 'ninh-dieu',
            affinityDelta: 10,
            rewardDescription: 'Hảo cảm Ninh Diêu +10, tốc độ phản ứng tăng',
          },
        ],
      },
      {
        id: 'scene-1-2',
        chapterId: 'hoi-01',
        title: 'Khí Tiết Tề Tiên Sinh',
        minRealmIndex: R['thao-can-1'],
        blocks: [
          {
            text: 'Trời đất biến sắc, bầu trời Ly Châu Động Thiên nứt toác từng mảng lớn. Thiên đạo áp chế giáng xuống muốn xóa sổ toàn bộ trấn nhỏ.',
          },
          {
            text: 'Tề Tĩnh Xuân đứng trên đỉnh đình Hòe Thụ, trường bào phần phật bay trong cuồng phong, hai tay chắp sau lưng, một mình đối diện với ngàn đạo sấm sét.',
          },
          {
            speaker: 'Tề Tĩnh Xuân',
            text: 'Tề Tĩnh Xuân ta sinh ra trong đất trời, nguyện lấy thân này gánh chịu nhân quả của sáu mươi năm trấn nhỏ, đổi lấy một con đường sống cho hậu sinh!',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Tề tiên sinh! Không thể để người một mình...',
          },
          {
            speaker: 'Tề Tĩnh Xuân',
            text: 'Bình An, đưa lũ trẻ đi. Nam hạ Bảo Bình Châu, tới Sơn Nhai Thư Viện. Nhớ kỹ: Cứ coi như thế gian này đen tối, hãy làm ngọn nến của chính mình!',
          },
        ],
      },
    ],
  },
  {
    id: 'hoi-02',
    index: 2,
    title: 'Hồi 2: Thiên Lý Tống Thư',
    subtitle: 'Đường Xa Cõng Gùi Trúc',
    summary: 'Rời khỏi quê hương đã hóa thành gạch vụn, Trần Bình An mang gùi trúc đưa nhóm trẻ Lý Bảo Bình vượt muôn trùng sơn hà, gặp gỡ đại kiếm tiên A Lương.',
    scenes: [
      {
        id: 'scene-2-1',
        chapterId: 'hoi-02',
        title: 'Mũ Đỏ & Gùi Trúc Nhỏ',
        minRealmIndex: R['lieu-can-1'],
        blocks: [
          {
            text: 'Trên con đường mòn đất đỏ rời khỏi quận Long Tuyền, Lý Bảo Bình đội chiếc mũ đỏ tươi cười rạng rỡ, tay cầm nhánh cây chỉ trỏ phong cảnh.',
          },
          {
            speaker: 'Lý Bảo Bình',
            text: 'Tiểu sư thúc! Chúng ta đi vạn dặm tống thư, có phải giống như hiệp khách trong sách tiên sinh kể không?',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Hiệp khách gì chứ, chỉ là một đứa trẻ mồ côi đưa ba đứa trẻ khác đi tìm trường học thôi. Đi đứng cẩn thận, sắp qua địa giới rừng rậm rồi.',
          },
        ],
      },
      {
        id: 'scene-2-2',
        chapterId: 'hoi-02',
        title: 'Đại Kiếm Tiên A Lương Xuất Hiện',
        minRealmIndex: R['khi-cot-1'],
        blocks: [
          {
            text: 'Bên bờ suối, một đại hán đầu đội nón lá rách, miệng ngậm cọng cỏ xanh, một tay cầm bầu rượu, hông đeo thanh đao cùn đang ngửa mặt huýt sáo.',
          },
          {
            speaker: 'A Lương',
            text: 'Ai chà, thằng nhóc gùi trúc kia! Đi đứng kiểu gì mà quyền ý lủng củng thế? Có biết A Lương ta kiếm khí dài ba vạn dặm không hả?',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Tiền bối... người đeo đao chứ có phải kiếm đâu?',
          },
          {
            speaker: 'A Lương',
            text: 'Ha ha ha! Kiếm hay đao thì có hề gì, kiếm ý tại tâm! Lại đây, uống ngụm rượu rồi ta dạy cho ngươi mười bảy quyền chân chính!',
          },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Cung kính xin thỉnh giáo quyền pháp từ A Lương',
            outcomeText: 'A Lương cười ha hả, vung tay truyền dạy quyền ý Hám Sơn Quyền Phổ chân truyền, uy lực vô song.',
            npcId: 'a-luong',
            affinityDelta: 25,
            rewardDescription: 'Hảo cảm A Lương +25, uy lực quyền cước tăng mạnh',
          },
          {
            id: 'c2',
            text: 'Mời A Lương ăn thử lương khô và uống nước suối',
            outcomeText: 'A Lương vỗ vai Bình An khen thằng nhóc này có trước có sau, tặng cho một cọng cỏ ngậm trừ tà.',
            npcId: 'a-luong',
            affinityDelta: 15,
            rewardDescription: 'Hảo cảm A Lương +15',
          },
        ],
      },
    ],
  },
  {
    id: 'hoi-03',
    index: 3,
    title: 'Hồi 3: Lạc Phách Sơn',
    subtitle: 'Khai Tông Lập Phái',
    summary: 'Trở về quê hương, mua lại ngọn núi Lạc Phách Sơn hoang tàn, phong thần Ngụy Bách, thu nhận Bùi Tiền, Thôi Đông Sơn, tạo dựng tông môn rường cột.',
    scenes: [
      {
        id: 'scene-3-1',
        chapterId: 'hoi-03',
        title: 'Phong Thần Ngụy Bách',
        minRealmIndex: R['dong-phu-1'],
        blocks: [
          {
            text: 'Trần Bình An đứng trước vách đá Lạc Phách Sơn. Vị thần linh áo trắng Ngụy Bách hiện thân giữa làn sương sớm, cúi đầu thi lễ.',
          },
          {
            speaker: 'Ngụy Bách',
            text: 'Sơn chủ trở về, phong cảnh Lạc Phách Sơn như bừng tỉnh. Ngụy Bách nguyện phụng sự bắc nhạc giang sơn, cùng người giữ gìn quy củ.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Núi này là nhà của chúng ta. Bất kể là người, là thần hay là quỷ, chỉ cần có quy củ, Lạc Phách Sơn đều có chỗ dung thân.',
          },
        ],
      },
    ],
  },
  {
    id: 'hoi-04',
    index: 4,
    title: 'Hồi 4: Kiếm Khí Trường Thành',
    subtitle: 'Ẩn Quan Áo Xanh',
    summary: 'Bước chân lên đầu tường thành ngàn năm nhuốm máu, hội ngộ Ninh Diêu, nhận lấy thanh kiếm truyền thừa từ Trần Thanh Đô, trở thành Ẩn Quan trấn thủ Man Hoang.',
    scenes: [
      {
        id: 'scene-4-1',
        chapterId: 'hoi-04',
        title: 'Hội Ngộ Trên Tường Thành',
        minRealmIndex: R['long-mon-1'],
        blocks: [
          {
            text: 'Gió cát phương bắc cuồn cuộn thổi qua bức tường thành khổng lồ. Phía xa xa, Man Hoang yêu tộc gầm rống rung chuyển đất trời.',
          },
          {
            text: 'Một bóng áo xanh tuyệt mỹ bay tới, thanh kiếm Thiên Chân trong tay phát ra tiếng ngân thanh thúy.',
          },
          {
            speaker: 'Ninh Diêu',
            text: 'Trần Bình An, ngươi đến muộn đấy.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Đã hứa với nàng mười năm, cho dù cách trở muôn trùng thiên hạ, ta nhất định phải tới.',
          },
        ],
      },
      {
        id: 'scene-4-2',
        chapterId: 'hoi-04',
        title: 'Khắc Chữ Lên Tường Thành',
        minRealmIndex: R['kim-dan-1'],
        blocks: [
          {
            speaker: 'Trần Thanh Đô',
            text: 'Thằng nhóc áo xanh kia, vị trí Ẩn Quan này giao cho ngươi. Ngươi có dám một kiếm ngăn vạn yêu?',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Trần Bình An ta nhận chức Ẩn Quan, kiếm dưới chân, đạo trong lòng, tuyệt không lùi một bước!',
          },
          {
            text: 'Thiếu niên áo xanh rút kiếm khắc lên mặt đá tường thành một chữ "BÌNH". Kiếm khí ngút ngàn ba vạn dặm xé toang mây đen Man Hoang!',
          },
        ],
      },
    ],
  },
  {
    id: 'hoi-05',
    index: 5,
    title: 'Hồi 5: Vấn Kiếm Thiên Hạ',
    subtitle: 'Đại Đạo Kiếm Lai',
    summary: 'Bản mệnh song phi kiếm Lung Trung Tước & Tỉnh Trung Nguyệt xuất thế, cùng Ninh Diêu hoàn thành ước nguyện thế gian, đạt đến cảnh giới tối cao.',
    scenes: [
      {
        id: 'scene-5-1',
        chapterId: 'hoi-05',
        title: 'Kiếm Lai!',
        minRealmIndex: R['phi-thang-1'],
        blocks: [
          {
            text: 'Giữa hư không vô tận, ngàn vạn phi kiếm đồng loạt phát ra tiếng ngân vang vọng cửu thiên thập địa.',
          },
          {
            speaker: 'Trần Bình An',
            text: 'Thiên địa bất bình, dĩ kiếm bình chi. Nhân tâm bất chính, dĩ đạo chính chi.',
          },
          {
            text: 'Thanh âm "KIẾM LAI!" chấn động các tòa thiên hạ. Thiếu niên ngõ Nê Bình năm xưa nay đã đứng trên đỉnh cao nhân gian, đổi lấy hai chữ "Bình An" cho muôn đời.',
          },
        ],
      },
    ],
  },
]

export const CHAPTER_BY_ID: Readonly<Record<string, StoryChapter>> = Object.fromEntries(
  CHAPTERS.map((c) => [c.id, c]),
)

